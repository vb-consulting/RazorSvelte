using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Localization;
using System.Globalization;
using RazorSvelte.Auth;
using RazorSvelte.Data;
using System.Net;

namespace RazorSvelte;

public static class AppBuilder
{
    public static void ConfigureApp(this WebApplicationBuilder builder)
    {
        JsonConvert.DefaultSettings = () => new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        builder.ConfigureAuth();
        builder.ConfigureLocalization();
        //builder.ConfigureDatabase();
        builder.ConfigureEndpoints();
    }

    public static void UseApp(this WebApplication app)
    {
        app.UseStatusCodePages(context =>
        {
            var request = context.HttpContext.Request;
            var response = context.HttpContext.Response;
            var path = request.Path.Value ?? "";

            // if request is unauthorized and is not api or javascript request - redirect to default login page
            if (response.StatusCode == (int)HttpStatusCode.Unauthorized &&
                !path.StartsWith($"{Consts.ApiSegment}/") &&
                !path.EndsWith(".js"))
            {
                response.Redirect(Urls.UnathorizedUrl);
            }
            return Task.CompletedTask;
        });

        app.MapFallback(context =>
        {
            if (!context.Request.Path.StartsWithSegments(Consts.ApiSegment))
            {
                context.Response.Redirect(Urls.NotFoundUrl);
            }
            return Task.CompletedTask;
        });

        app.UseAuth();
        //app.UseDatabase();
        app.UseEndpoints();
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