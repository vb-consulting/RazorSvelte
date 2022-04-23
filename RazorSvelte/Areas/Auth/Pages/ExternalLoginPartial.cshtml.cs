using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RazorSvelte.Auth.Pages;

[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
[IgnoreAntiforgeryToken]
[AllowAnonymous]
public abstract class ExternalLoginPartial : PageModel
{
    private readonly ExternalLoginConfig config;

    public string State { get; private set; }
    public string? AuthUrl { get; private set; }
    public string? LoginUrl { get; private set; }
    public ExternalType ExternalType { get; private set; }

    public ExternalLoginPartial(ExternalLoginConfig config, ExternalType type)
    {
        this.config = config;
        ExternalType = type;
        State = Guid.NewGuid().ToString();
        LoginUrl = config.LoginUrl;
    }

    public void OnGet()
    {
        var redirectUrl = $"{Request.Scheme}://{Request.Host}{config.RedirectPath}";
        if (config.AuthUrl is null)
        {
            throw new ArgumentException($"AuthUrl is not defined for provider {ExternalType}");
        }
        AuthUrl = string.Format(config.AuthUrl, config.ClientId, redirectUrl, State);
    }
}

