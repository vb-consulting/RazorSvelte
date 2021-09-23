using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace RazorSvelte.Auth
{
    public static class AuthExtensions
    {
        public static IServiceCollection ConfigureAuthServices(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtConfigSection = configuration.GetSection("JwtConfig");
            if (jwtConfigSection == null || string.IsNullOrEmpty(jwtConfigSection.GetValue<string>("Secret")))
            {
                return services;
            }
            services.Configure<JwtConfig>(jwtConfigSection);
            services.Configure<GoogleConfig>(configuration.GetSection("Authentication:Google"));
            services.Configure<LinkedInConfig>(configuration.GetSection("Authentication:LinkedIn"));
            services.Configure<GitHubConfig>(configuration.GetSection("Authentication:GitHub"));

            services.AddTransient<JwtManager, JwtManager>();
            services.AddTransient<RefreshTokenRepository, RefreshTokenRepository>();
            services.AddTransient<GoogleManager, GoogleManager>();
            services.AddTransient<LinkedInManager, LinkedInManager>();
            services.AddTransient<GitHubManager, GitHubManager>();

            var jwtManager = services.BuildServiceProvider().GetRequiredService<JwtManager>();

            services.AddAuthentication(options =>
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
            return services;
        }

        public static IApplicationBuilder ConfigureAuthRedirect(this IApplicationBuilder app)
        {
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
            return app;
        }
    }
}
