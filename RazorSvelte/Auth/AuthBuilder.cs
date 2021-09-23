using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace RazorSvelte.Auth;

public class AuthBuilder
{
    public readonly bool HasJwtSection = false;
    public readonly bool HasGoogleSection = false;
    public readonly bool HasLinkedInSection = false;
    public readonly bool HasGitHubSection = false;

    public AuthBuilder(WebApplicationBuilder builder)
    {
        IConfigurationSection? GetConfigSection(string key, string testKey)
        {
            var section = builder.Configuration.GetSection(key);
            if (section is null)
            {
                return null;
            }
            if (string.IsNullOrEmpty(section.GetValue<string>(testKey)))
            {
                return null;
            }
            return section;
        }

        var jwtConfigSection = GetConfigSection("JwtConfig", "Secret");
        HasJwtSection = jwtConfigSection != null;
        if (!HasJwtSection)
        {
            return;
        }
        builder.Services.Configure<JwtConfig>(jwtConfigSection);
        builder.Services.AddTransient<JwtManager, JwtManager>();
        builder.Services.AddTransient<RefreshTokenRepository, RefreshTokenRepository>();

        var googleSection = GetConfigSection("Authentication:Google", "ClientId");
        var linkedInSection = GetConfigSection("Authentication:LinkedIn", "ClientId");
        var gitHubSection = GetConfigSection("Authentication:GitHub", "ClientId");
        HasGoogleSection = googleSection != null;
        HasLinkedInSection = linkedInSection != null;
        HasGitHubSection = gitHubSection != null;

        if (HasGoogleSection || HasLinkedInSection || HasGitHubSection)
        {
            builder.Services.AddTransient<ExternalLoginHandler, ExternalLoginHandler>();
        }

        if (HasGoogleSection)
        {
            builder.Services.Configure<GoogleConfig>(googleSection);
            builder.Services.AddTransient<GoogleManager, GoogleManager>();
        }
        if (HasLinkedInSection)
        {
            builder.Services.Configure<LinkedInConfig>(linkedInSection);
            builder.Services.AddTransient<LinkedInManager, LinkedInManager>();
        }
        if (HasGitHubSection)
        {
            builder.Services.Configure<GitHubConfig>(gitHubSection);
            builder.Services.AddTransient<GitHubManager, GitHubManager>();
        }

        var jwtManager = builder.Services.BuildServiceProvider().GetRequiredService<JwtManager>();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = true;
            options.SaveToken = true;
            options.TokenValidationParameters = jwtManager.GetTokenValidationParameters();
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = jwtManager.ParseTokenFromMessage(context);
                    return Task.CompletedTask;
                }
            };
        });
    }

    public void BuildAuth(WebApplication app)
    {
        if (!HasGoogleSection && !HasLinkedInSection && !HasGitHubSection)
        {
            return;
        }

        if (HasGoogleSection)
        {
            app.MapPost(Urls.LoginGoogleUrl,
                async (HttpContext context, GoogleManager manager, ExternalLoginHandler handler, [FromBody] IDictionary<string, string> parameters) => await handler
                .ProcessExternalLoginAsync(context, manager, parameters))
                .AllowAnonymous();
        }
        if (HasLinkedInSection)
        {
            app.MapPost(Urls.LoginLinkedInUrl,
                async (HttpContext context, LinkedInManager manager, ExternalLoginHandler handler, [FromBody] IDictionary<string, string> parameters) => await handler
                .ProcessExternalLoginAsync(context, manager, parameters))
                .AllowAnonymous();
        }
        if (HasGitHubSection)
        {
            app.MapPost(Urls.LoginGitHubUrl,
                async (HttpContext context, GitHubManager manager, ExternalLoginHandler handler, [FromBody] IDictionary<string, string> parameters) => await handler
                .ProcessExternalLoginAsync(context, manager, parameters))
                .AllowAnonymous();
        }

        app.UseStatusCodePages(context =>
        {
            var request = context.HttpContext.Request;
            var response = context.HttpContext.Response;
            var path = request.Path.Value ?? "";

            // if request is unauthorized and is not api or javascript request - redirect to default login page
            if (response.StatusCode == (int)HttpStatusCode.Unauthorized &&
                !path.StartsWith("/api/") &&
                !path.EndsWith(".js"))
            {
                response.Redirect(Urls.UnathorizedUrl);
            }
            return Task.CompletedTask;
        });

        app.UseAuthentication();
    }
}

