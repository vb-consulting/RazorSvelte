using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace RazorSvelte.Auth
{
    public class JwtManager
    {
        private readonly JwtConfig config;
        private readonly RefreshTokenRepository refreshTokenRepository;

        public JwtManager(IOptionsMonitor<JwtConfig> config, RefreshTokenRepository refreshTokenRepository)
        {
            this.config = config.CurrentValue;
            this.refreshTokenRepository = refreshTokenRepository;
        }

        public TokenValidationParameters GetTokenValidationParameters() => new()
        {
            ValidateIssuer = true,
            ValidIssuer = config.Issuer,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.Secret)),
            ValidAudience = config.Audience,
            ValidateAudience = config.Audience != null,
            ValidateLifetime = true,
            ClockSkew = config.ClockSkewMin == null ? TimeSpan.Zero : TimeSpan.FromMinutes(config.ClockSkewMin.Value),
            RequireExpirationTime = config.ExpirationMin != null
        };

        public void CreateJwtResponseFromExternalLogin(ExternalLoginResponse externalLoginResponse, HttpResponse response)
        {
            var jwtToken = CreateJwtToken(new List<Claim>()
            {
                new Claim(ClaimTypes.Name, externalLoginResponse.Email),
                new Claim(ClaimTypes.Email, externalLoginResponse.Email),
                new Claim(ClaimTypes.NameIdentifier, externalLoginResponse.Name),
                new Claim("timezone", externalLoginResponse.Timezone),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString("u")),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            });
            string value;
            if (config.RefreshTokenExpirationMin.HasValue)
            {
                var (refreshToken, refreshTokenExpiryDate) = CreateRefreshToken();
                value = $"{GetTokenValue(jwtToken)};{refreshToken}";
                CreateAuthCookie(response, value);
                refreshTokenRepository.AddOrUpdate(jwtToken, refreshToken, refreshTokenExpiryDate);
            }
            else
            {
                value = $"{GetTokenValue(jwtToken)}";
                CreateAuthCookie(response, value);
            }
        }

        public string ParseTokenFromMessage(MessageReceivedContext context)
        {
            var value = context.Request.Cookies[config.CookieName];
            if (value == null)
            {
                return value;
            }
            string token, refresh;
            if (config.RefreshTokenExpirationMin.HasValue)
            {
                var split = value.Split(';');
                token = split.First();
                refresh = split.Last();
                var oldJwt = new JwtSecurityToken(token);
                if (DateTime.UtcNow > oldJwt.ValidTo)
                {
                    var (refreshToken, refreshTokenExpiryDate) = refreshTokenRepository.Get(oldJwt);
                    if (refreshToken is null && refreshTokenExpiryDate is null)
                    {
                        return null;
                    }
                    if (DateTime.UtcNow > refreshTokenExpiryDate.Value)
                    {
                        refreshTokenRepository.Remove(oldJwt);
                        return null;
                    }
                    if (!string.Equals(refresh, refreshToken))
                    {
                        refreshTokenRepository.Remove(oldJwt);
                        return null;
                    }
                    var jwtToken = CreateJwtToken(oldJwt.Claims.ToList());
                    token = GetTokenValue(jwtToken);
                    (refresh, refreshTokenExpiryDate) = CreateRefreshToken();
                    refreshTokenRepository.AddOrUpdate(jwtToken, refresh, refreshTokenExpiryDate.Value);
                    CreateAuthCookie(context.Response, $"{token};{refresh}");
                }
                return token;
            }
            else
            {
                return value;
            }
        }

        private void CreateAuthCookie(HttpResponse response, string value)
        {
            response.Cookies.Append(config.CookieName, value, new CookieOptions
            {
                Path = "/",
                HttpOnly = true,
                Expires = DateTime.Now.AddMinutes(config.CookieExpirationMin),
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
        }

        private JwtSecurityToken CreateJwtToken(IEnumerable<Claim> claims)
        {
            var shouldAddAudienceClaim = string.IsNullOrWhiteSpace(claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);
            return new JwtSecurityToken(
                config.Issuer,
                shouldAddAudienceClaim ? config.Audience : string.Empty,
                claims,
                expires: config.ExpirationMin.HasValue ? DateTime.Now.AddMinutes(config.ExpirationMin.Value) : null,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.Secret)), SecurityAlgorithms.HmacSha256Signature));
        }

        private static string GetTokenValue(JwtSecurityToken jwt) => new JwtSecurityTokenHandler().WriteToken(jwt);

        private (string, DateTime) CreateRefreshToken() => (RandomString(50), DateTime.UtcNow.AddMinutes(config.RefreshTokenExpirationMin.Value));

        private const string _chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        private static string RandomString(int length)
        {
            var random = new Random(DateTime.Now.Millisecond);
            return new string(Enumerable.Repeat(_chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
