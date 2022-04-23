namespace RazorSvelte.Auth;

public class GoogleConfig : ExternalLoginConfig
{
    public GoogleConfig()
    {
        RedirectPath = Urls.SignInGoogleUrl;
        LoginUrl = AuthBuilder.LoginGoogleUrl;
    }
}
