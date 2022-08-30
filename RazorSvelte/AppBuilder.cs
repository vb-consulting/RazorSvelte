using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using RazorSvelte.Auth;
using RazorSvelte.Data;

namespace RazorSvelte;

public static class AppBuilder
{
    public static void ConfigureApp(this WebApplicationBuilder builder)
    {
        JsonConvert.DefaultSettings = () => new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        builder.ConfigureLocalization();
        builder.ConfigureAuth();
        //builder.ConfigureDatabase();
        builder.ConfigureEndpoints();
    }

    public static void UseApp(this WebApplication app)
    {
        app.MapFallback();
        app.UseAuth();
        //app.UseDatabase();
        app.UseEndpoints();
    }

    private static void MapFallback(this WebApplication app)
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

    private static void ConfigureLocalization(this WebApplicationBuilder builder)
    {
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
    }
}