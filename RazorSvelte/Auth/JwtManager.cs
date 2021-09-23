using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RazorSvelte.Auth;

public class JwtManager
{
    private readonly JwtConfig config;
    private readonly RefreshTokenRepository refreshTokenRepository;

    public JwtManager(IOptionsMonitor<JwtConfig> config, RefreshTokenRepository refreshTokenRepository)
    {
        this.config = config.CurrentValue;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public TokenValidationParameters GetTokenValidationParameters()
    {
        if (config.Secret is null)
        {
            return new();
        }
        return new()
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
    }

    public void CreateJwtResponseFromExternalLogin(ExternalLoginResponse externalLoginResponse, HttpResponse response)
    {
        if (externalLoginResponse.Email is null || externalLoginResponse.Name is null || externalLoginResponse.Timezone is null)
        {
            return;
        }
        var jwtToken = CreateJwtToken(new List<Claim>()
            {
                new(ClaimTypes.Name, externalLoginResponse.Email),
                new(ClaimTypes.Email, externalLoginResponse.Email),
                new(ClaimTypes.NameIdentifier, externalLoginResponse.Name),
                new("timezone", externalLoginResponse.Timezone),
                new(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString("u")),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            });
        if (config.RefreshTokenExpirationMin.HasValue)
        {
            var (refreshToken, refreshTokenExpiryDate) = CreateRefreshToken();
            CreateAuthCookie(response, $"{GetTokenValue(jwtToken)};{refreshToken}");
            refreshTokenRepository.AddOrUpdate(jwtToken, refreshToken, refreshTokenExpiryDate);
        }
        else
        {
            CreateAuthCookie(response, GetTokenValue(jwtToken));
        }
    }

    public string? ParseTokenFromMessage(MessageReceivedContext context)
    {
        if (config.CookieName is null)
        {
            return null;
        }
        var value = context.Request.Cookies[config.CookieName];
        if (value == null)
        {
            return null;
        }
        if (!config.RefreshTokenExpirationMin.HasValue)
        {
            return value;
        }

        var split = value.Split(';');
        var token = split.First();
        var refresh = split.Last();
        var oldJwt = new JwtSecurityToken(token);
        if (DateTime.UtcNow <= oldJwt.ValidTo)
        {
            return token;
        }
        var (refreshToken, refreshTokenExpiryDate) = refreshTokenRepository.Get(oldJwt);
        if (refreshToken is null)
        {
            return null;
        }
        if (refreshTokenExpiryDate is null)
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
        return token;
    }

    private void CreateAuthCookie(HttpResponse response, string value)
    {
        if (config.CookieName is null)
        {
            return;
        }
        if (config.CookieExpirationMin is null)
        {
            return;
        }
        response.Cookies.Append(config.CookieName, value, new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            Expires = DateTime.Now.AddMinutes(config.CookieExpirationMin.Value),
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });
    }

    private JwtSecurityToken CreateJwtToken(IEnumerable<Claim> claims)
    {
        if (config.Secret is null)
        {
            return new();
        }
        var enumerable = claims as Claim[] ?? claims.ToArray();
        var shouldAddAudienceClaim = string.IsNullOrWhiteSpace(enumerable?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);
        return new JwtSecurityToken(
            config.Issuer,
            shouldAddAudienceClaim ? config.Audience : string.Empty,
            enumerable,
            expires: config.ExpirationMin.HasValue ? DateTime.Now.AddMinutes(config.ExpirationMin.Value) : null,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.Secret)), SecurityAlgorithms.HmacSha256Signature));
    }

    private static string GetTokenValue(JwtSecurityToken jwt) => new JwtSecurityTokenHandler().WriteToken(jwt);

    private (string, DateTime) CreateRefreshToken() =>
        (RandomString(50), DateTime.UtcNow.AddMinutes(config.RefreshTokenExpirationMin is null ? 0 : config.RefreshTokenExpirationMin.Value));

    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static string RandomString(int length)
    {
        var random = new Random(DateTime.Now.Millisecond);
        return new string(Enumerable.Repeat(Chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
