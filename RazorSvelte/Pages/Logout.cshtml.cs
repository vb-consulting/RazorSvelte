using RazorSvelte.Auth;

namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string LogoutUrl = "/logout";
}

public class LogoutModel : PageModel
{
    private readonly JwtConfig _jwtConfig;

    public LogoutModel(IOptionsMonitor<JwtConfig> jwtConfig)
    {
        this._jwtConfig = jwtConfig.CurrentValue;
    }

    public void OnGet()
    {
        if (_jwtConfig.CookieName == null)
        {
            return;
        }
        if (!Request.Cookies.ContainsKey(_jwtConfig.CookieName))
        {
            return;
        }
        Response.Cookies.Delete(_jwtConfig.CookieName);
        Response.Redirect(Urls.IndexUrl);
    }
}
