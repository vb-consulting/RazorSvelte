using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace RazorSvelte.Auth
{
    public static class AuthExtensions
    {
        public static IServiceCollection ConfigureAuth(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtConfigSection = configuration.GetSection("JwtConfig");
            var jwtConfig = jwtConfigSection.Get<JwtConfig>();
            services.Configure<JwtConfig>(jwtConfigSection);
            services.Configure<GoogleConfig>(configuration.GetSection("Authentication:Google"));
            services.Configure<LinkedInConfig>(configuration.GetSection("Authentication:LinkedIn"));
            services.Configure<GitHubConfig>(configuration.GetSection("Authentication:GitHub"));

            services.AddTransient<JwtManager, JwtManager>();
            services.AddTransient<GoogleManager, GoogleManager>();
            services.AddTransient<LinkedInManager, LinkedInManager>();
            services.AddTransient<GitHubManager, GitHubManager>();
            
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.Secret)),
                    ValidAudience = jwtConfig.Audience,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                    RequireExpirationTime = jwtConfig.ExpirationMin != null
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies[jwtConfig.CookieName];
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
                if (response.StatusCode == (int)HttpStatusCode.Unauthorized && !path.StartsWith("/api/") && !path.EndsWith(".js"))
                {
                    response.Redirect("/");
                }
                return Task.CompletedTask;
            });
            return app;
        }
        
    }
}
