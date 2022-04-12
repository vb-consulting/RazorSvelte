global using RazorSvelte.Auth;
global using Microsoft.AspNetCore.Mvc.RazorPages;
global using System;
global using System.Linq;
global using System.Text.Json;
global using Microsoft.Extensions.Options;

using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Globalization;
using Microsoft.AspNetCore.Localization;

JsonConvert.DefaultSettings = () => new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddHttpClient().AddOptions();
var authBuilder = new AuthBuilder(builder);

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(Consts.ErrorUrl);
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
authBuilder.BuildAuth(app);
app.UseAuthorization();
app.MapRazorPages();
MapFallback(app);
ConfigureLocalization(builder.Configuration);

app.Run();

static void MapFallback(WebApplication app)
{
    app.MapFallback(context =>
    {
        if (!context.Request.Path.StartsWithSegments(Consts.ApiSegment))
        {
            context.Response.Redirect(Consts.NotFoundUrl);
        }
        return Task.CompletedTask;
    });
}

static void ConfigureLocalization(ConfigurationManager configuration)
{
    var localizationEnabled = configuration.GetValue<bool>("EnableBrowserRequestLocalization");
    if (localizationEnabled is true)
    {
        var defaultCulture = configuration.GetValue<string>("DefaultCulture") ?? "en-US";
        var supportedCultures = CultureInfo.GetCultures(CultureTypes.AllCultures).Where(cul => !string.IsNullOrEmpty(cul.Name)).ToList();
        var localizationOptions = new RequestLocalizationOptions
        {
            ApplyCurrentCultureToResponseHeaders = true,
            DefaultRequestCulture = new RequestCulture(defaultCulture),
            SupportedCultures = supportedCultures,
            SupportedUICultures = supportedCultures,
            RequestCultureProviders = new List<IRequestCultureProvider>
            {
                new CustomRequestCultureProvider(ctx =>
                {
                    var lang = ctx.Request.Headers["Accept-Language"].ToString().Split(',').FirstOrDefault();
                    var culture = string.IsNullOrEmpty(lang) ? defaultCulture : lang;
                    ProviderCultureResult result = new(culture, culture);
                    return Task.FromResult((ProviderCultureResult?)result);
                })
            }
        };
    }
}

#pragma warning disable CA1050 // Declare types in namespaces
public class Consts
#pragma warning restore CA1050 // Declare types in namespaces
{
    [JsonProperty] public const string AuthorizedUrl = "/authorized";
    [JsonProperty] public const string IndexUrl = "/";
    public const string ErrorUrl = "/error";
    [JsonProperty] public const string LoginUrl = "/login";
    [JsonProperty] public const string LogoutUrl = "/logout";
    [JsonProperty] public const string PrivacyUrl = "/privacy";
    [JsonProperty] public const string SpaUrl = "/spa";
    public const string NotFoundUrl = "/404";
    public const string UnathorizedUrl = "/401";
    [JsonProperty] public const string SignInGoogleUrl = "/signin-google";
    [JsonProperty] public const string SignInLinkedInUrl = "/signin-linkedin";
    [JsonProperty] public const string SignInGitHubUrl = "/signin-github";

    public const string ApiSegment = "/api";

    public const string LoginGoogleUrl = $"{ApiSegment}/google-login";
    public const string LoginLinkedInUrl = $"{ApiSegment}/linkedin-login";
    public const string LoginGitHubUrl = $"{ApiSegment}/github-login";

    public const string ThemeKey = "theme";

    public static string Json { get; private set; }

    static Consts()
    {
        Json = JsonConvert.SerializeObject(new Consts());
    }
}