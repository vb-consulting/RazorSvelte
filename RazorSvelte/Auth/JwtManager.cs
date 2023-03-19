using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RazorSvelte.Auth;

public class JwtManager
{
    private readonly JwtConfig _config;
    private readonly RefreshTokenRepository _refreshTokenRepository;

    public JwtManager(IOptionsMonitor<JwtConfig> config, RefreshTokenRepository refreshTokenRepository)
    {
        this._config = config.CurrentValue;
        this._refreshTokenRepository = refreshTokenRepository;
    }

    public TokenValidationParameters GetTokenValidationParameters()
    {
        if (_config.Secret is null)
        {
            return new();
        }
        return new()
        {
            ValidateIssuer = true,
            ValidIssuer = _config.Issuer,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config.Secret)),
            ValidAudience = _config.Audience,
            ValidateAudience = _config.Audience != null,
            ValidateLifetime = true,
            ClockSkew = _config.ClockSkewMin == null ? TimeSpan.Zero : TimeSpan.FromMinutes(_config.ClockSkewMin.Value),
            RequireExpirationTime = _config.ExpirationMin != null
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
        if (_config.RefreshTokenExpirationMin.HasValue)
        {
            var (refreshToken, refreshTokenExpiryDate) = CreateRefreshToken();
            CreateAuthCookie(response, $"{GetTokenValue(jwtToken)};{refreshToken}");
            _refreshTokenRepository.AddOrUpdate(jwtToken, refreshToken, refreshTokenExpiryDate);
        }
        else
        {
            CreateAuthCookie(response, GetTokenValue(jwtToken));
        }
    }

    public string? ParseTokenFromMessage(MessageReceivedContext context)
    {
        if (_config.CookieName is null)
        {
            return null;
        }
        var value = context.Request.Cookies[_config.CookieName];
        if (value == null)
        {
            return null;
        }
        if (!_config.RefreshTokenExpirationMin.HasValue)
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
        var (refreshToken, refreshTokenExpiryDate) = _refreshTokenRepository.Get(oldJwt);
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
            _refreshTokenRepository.Remove(oldJwt);
            return null;
        }
        if (!string.Equals(refresh, refreshToken))
        {
            _refreshTokenRepository.Remove(oldJwt);
            return null;
        }
        var jwtToken = CreateJwtToken(oldJwt.Claims.ToList());
        token = GetTokenValue(jwtToken);
        (refresh, refreshTokenExpiryDate) = CreateRefreshToken();
        _refreshTokenRepository.AddOrUpdate(jwtToken, refresh, refreshTokenExpiryDate.Value);
        CreateAuthCookie(context.Response, $"{token};{refresh}");
        return token;
    }

    private void CreateAuthCookie(HttpResponse response, string value)
    {
        if (_config.CookieName is null)
        {
            return;
        }
        if (_config.CookieExpirationMin is null)
        {
            return;
        }
        response.Cookies.Append(_config.CookieName, value, new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            Expires = DateTime.Now.AddMinutes(_config.CookieExpirationMin.Value),
            IsEssential = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });
    }

    private JwtSecurityToken CreateJwtToken(IEnumerable<Claim> claims)
    {
        if (_config.Secret is null)
        {
            return new();
        }
        var enumerable = claims as Claim[] ?? claims.ToArray();
        var shouldAddAudienceClaim = string.IsNullOrWhiteSpace(enumerable?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);
        return new JwtSecurityToken(
            _config.Issuer,
            shouldAddAudienceClaim ? _config.Audience : string.Empty,
            enumerable,
            expires: _config.ExpirationMin.HasValue ? DateTime.Now.AddMinutes(_config.ExpirationMin.Value) : null,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config.Secret)), SecurityAlgorithms.HmacSha256Signature));
    }

    private static string GetTokenValue(JwtSecurityToken jwt) => new JwtSecurityTokenHandler().WriteToken(jwt);

    private (string, DateTime) CreateRefreshToken() =>
        (RandomString(50), DateTime.UtcNow.AddMinutes(_config.RefreshTokenExpirationMin is null ? 0 : _config.RefreshTokenExpirationMin.Value));

    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static string RandomString(int length)
    {
        var random = new Random(DateTime.Now.Millisecond);
        return new string(Enumerable.Repeat(Chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
