global using RazorSvelte;
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

var builder = WebApplication.CreateBuilder(args);

JsonConvert.DefaultSettings = () => new JsonSerializerSettings{ContractResolver = new CamelCasePropertyNamesContractResolver()};

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddHttpClient().AddOptions();
var authBuilder = new AuthBuilder(builder);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(Urls.ErrorUrl);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

authBuilder.BuildAuth(app);

app.UseAuthorization();

app.MapRazorPages();

app.MapFallback(context =>
{
    if (!context.Request.Path.StartsWithSegments(Urls.ApiSegment))
    {
        context.Response.Redirect(Urls.NotFoundUrl);
    }
    return Task.CompletedTask;
});

var localizationEnabled = builder.Configuration.GetValue<bool>("EnableBrowserRequestLocalization");
if (localizationEnabled is true)
{
    var defaultCulture = builder.Configuration.GetValue<string>("DefaultCulture") ?? "en-US";
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

app.Run();
