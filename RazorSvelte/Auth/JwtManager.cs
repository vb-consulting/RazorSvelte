using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace RazorSvelte.Auth
{
    public class JwtManager
    {
        private readonly JwtConfig config;

        public JwtManager(IOptionsMonitor<JwtConfig> config)
        {
            this.config = config.CurrentValue;
        }

        public string CreateJwtToken(ExternalLoginResponse response)
        {
            return CreateJwtToken(new List<Claim>()
            {
                new Claim(ClaimTypes.Name, response.Email),
                new Claim(ClaimTypes.Email, response.Email),
                new Claim(ClaimTypes.NameIdentifier, response.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("timezone", response.Timezone),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString("u"))
            });
        }

        private string CreateJwtToken(IEnumerable<Claim> claims)
        {
            var shouldAddAudienceClaim = string.IsNullOrWhiteSpace(claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);
            var jwtToken = new JwtSecurityToken(
                config.Issuer,
                shouldAddAudienceClaim ? config.Audience : string.Empty,
                claims,
                expires: config.ExpirationMin.HasValue ? DateTime.Now.AddMinutes(config.ExpirationMin.Value) : null,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.Secret)), SecurityAlgorithms.HmacSha256Signature));
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
