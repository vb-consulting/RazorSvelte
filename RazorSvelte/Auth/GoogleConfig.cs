namespace RazorSvelte.Auth;

public class GoogleConfig : ExternalLoginConfig
{
    public GoogleConfig()
    {
        RedirectPath = Consts.SignInGoogleUrl;
        LoginUrl = Consts.LoginGoogleUrl;
    }
}
