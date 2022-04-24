global using Microsoft.AspNetCore.Mvc.RazorPages;
global using System;
global using System.Linq;
global using System.Text.Json;
global using Microsoft.Extensions.Options;
global using RazorSvelte.Pages;

using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using RazorSvelte.Auth;

JsonConvert.DefaultSettings = () => new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddHttpClient().AddOptions();
builder.ConfigureAuth();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(Urls.ErrorUrl);
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuth();
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
            context.Response.Redirect(Urls.NotFoundUrl);
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
