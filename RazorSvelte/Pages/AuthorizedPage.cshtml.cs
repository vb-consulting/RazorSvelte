using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string AuthorizedUrl = "/authorized";
}

[Authorize]
public class AuthorizedPageModel : PageModel
{
    public string? UserValues { get; private set; }

    public void OnGet()
    {
        UserValues = JsonSerializer.Serialize(new
        {
            name = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
            email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
            timezone = User.Claims.FirstOrDefault(c => c.Type == "timezone")?.Value,
            timestamp = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.AuthTime)?.Value
        });
    }
}
