using RazorSvelte.Auth;

namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string LogoutUrl = "/logout";
}

public class LogoutModel : PageModel
{
    private readonly JwtConfig jwtConfig;

    public LogoutModel(IOptionsMonitor<JwtConfig> jwtConfig)
    {
        this.jwtConfig = jwtConfig.CurrentValue;
    }

    public void OnGet()
    {
        if (jwtConfig.CookieName == null)
        {
            return;
        }
        if (!Request.Cookies.ContainsKey(jwtConfig.CookieName))
        {
            return;
        }
        Response.Cookies.Delete(jwtConfig.CookieName);
        Response.Redirect(Urls.IndexUrl);
    }
}
