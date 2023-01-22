using Microsoft.AspNetCore.Localization;
using System.Globalization;
using System.Net;
using System.Reflection;

namespace RazorSvelte;

public static class AppBuilder
{
    private static readonly Type[] endpointTypes = Assembly
        .GetExecutingAssembly()
        .GetTypes()
        .Where(t => t != typeof(EndpointBuilder) && t.IsClass && t.GetMethods(BindingFlags.Public | BindingFlags.Static).Any(m => m.Name == nameof(UseEndpoints)))
        .ToArray();

    public static Type[] EndpointTypes => endpointTypes;
    
    public static void ConfigureApp(this WebApplicationBuilder builder)
    {
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
                response.Redirect(Pages.Urls.UnathorizedUrl);
            }
            return Task.CompletedTask;
        });

        app.MapFallback(context =>
        {
            if (!context.Request.Path.StartsWithSegments(Consts.ApiSegment))
            {
                context.Response.Redirect(Pages.Urls.NotFoundUrl);
            }
            return Task.CompletedTask;
        });

        app.UseAuth();
        //app.UseDatabase();
        app.UseEndpoints();
    }

    private static void ConfigureEndpoints(this WebApplicationBuilder builder)
    {
        foreach (var endpointType in endpointTypes)
        {
            foreach (var method in endpointType.GetMethods(BindingFlags.Public | BindingFlags.Static).Where(m => m.Name == nameof(ConfigureEndpoints)))
            {
                var p = method.GetParameters();
                if (p.Length == 1 && p[0].ParameterType == typeof(WebApplicationBuilder))
                {
                    method.Invoke(null, new[] { builder });
                }
            }
        }
    }

    private static void UseEndpoints(this WebApplication app)
    {
        foreach (var endpointType in endpointTypes)
        {
            foreach (var method in endpointType.GetMethods(BindingFlags.Public | BindingFlags.Static).Where(m => m.Name == nameof(UseEndpoints)))
            {
                var p = method.GetParameters();
                if (p.Length == 1 && p[0].ParameterType == typeof(WebApplication))
                {
                    method.Invoke(null, new[] { app });
                }
            }
        }
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