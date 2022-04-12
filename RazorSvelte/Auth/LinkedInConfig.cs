namespace RazorSvelte.Auth;

public class LinkedInConfig : ExternalLoginConfig
{
    public LinkedInConfig()
    {
        RedirectPath = Consts.SignInLinkedInUrl;
        LoginUrl = Consts.LoginLinkedInUrl;
    }
}
