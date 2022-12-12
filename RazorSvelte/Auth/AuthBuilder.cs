using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;

namespace RazorSvelte.Auth;

public static class AuthBuilder
{
    public const string LoginGoogleUrl = $"{Consts.ApiSegment}/google-login";
    public const string LoginLinkedInUrl = $"{Consts.ApiSegment}/linkedin-login";
    public const string LoginGitHubUrl = $"{Consts.ApiSegment}/github-login";

    private static bool hasJwtSection = false;
    private static bool hasGoogleSection = false;
    private static bool hasLinkedInSection = false;
    private static bool hasGitHubSection = false;

    public static void ConfigureAuth(this WebApplicationBuilder builder)
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
        hasJwtSection = jwtConfigSection != null;
        if (!hasJwtSection || jwtConfigSection is null)
        {
            return;
        }
        builder.Services.Configure<JwtConfig>(jwtConfigSection);
        builder.Services.AddTransient<JwtManager, JwtManager>();
        builder.Services.AddTransient<RefreshTokenRepository, RefreshTokenRepository>();

        var googleSection = GetConfigSection("Authentication:Google", "ClientId");
        var linkedInSection = GetConfigSection("Authentication:LinkedIn", "ClientId");
        var gitHubSection = GetConfigSection("Authentication:GitHub", "ClientId");
        hasGoogleSection = googleSection != null;
        hasLinkedInSection = linkedInSection != null;
        hasGitHubSection = gitHubSection != null;

        if (hasGoogleSection || hasLinkedInSection || hasGitHubSection)
        {
            builder.Services.AddTransient<ExternalLoginHandler, ExternalLoginHandler>();
        }
        if (hasGoogleSection && googleSection is not null)
        {
            builder.Services.Configure<GoogleConfig>(googleSection);
            builder.Services.AddTransient<GoogleManager, GoogleManager>();
        }
        if (hasLinkedInSection && linkedInSection is not null)
        {
            builder.Services.Configure<LinkedInConfig>(linkedInSection);
            builder.Services.AddTransient<LinkedInManager, LinkedInManager>();
        }
        if (hasGitHubSection && gitHubSection is not null)
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

    public static void UseAuth(this WebApplication app)
    {
        if (!hasGoogleSection && !hasLinkedInSection && !hasGitHubSection)
        {
            return;
        }

        if (hasGoogleSection)
        {
            app.MapPost(LoginGoogleUrl,
                async (HttpContext context, GoogleManager manager, ExternalLoginHandler handler, [FromBody] IDictionary<string, string> parameters) => await handler
                .ProcessExternalLoginAsync(context, manager, parameters))
                .AllowAnonymous();
        }
        if (hasLinkedInSection)
        {
            app.MapPost(LoginLinkedInUrl,
                async (HttpContext context, LinkedInManager manager, ExternalLoginHandler handler, [FromBody] IDictionary<string, string> parameters) => await handler
                .ProcessExternalLoginAsync(context, manager, parameters))
                .AllowAnonymous();
        }
        if (hasGitHubSection)
        {
            app.MapPost(LoginGitHubUrl,
                async (HttpContext context, GitHubManager manager, ExternalLoginHandler handler, [FromBody] IDictionary<string, string> parameters) => await handler
                .ProcessExternalLoginAsync(context, manager, parameters))
                .AllowAnonymous();
        }

        app.UseAuthentication();
    }
}
