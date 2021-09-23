namespace RazorSvelte.Auth;

public class LinkedInConfig : ExternalLoginConfig
{
    public LinkedInConfig()
    {
        RedirectPath = Urls.SignInLinkedInUrl;
        LoginUrl = Urls.LoginLinkedInUrl;
    }
}
