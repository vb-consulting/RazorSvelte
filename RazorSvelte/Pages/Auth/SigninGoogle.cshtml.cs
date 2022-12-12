namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string SignInGoogleUrl = "/signin-google";
}

public class SigninGoogle : ExternalLoginPartial
{
    public SigninGoogle(IOptionsMonitor<GoogleConfig> config) : base(config.CurrentValue, ExternalType.Google) { }
}
