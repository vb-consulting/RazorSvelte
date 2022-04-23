namespace RazorSvelte.Auth.Pages;

public class SigninGoogle : ExternalLoginPartial
{
    public SigninGoogle(IOptionsMonitor<GoogleConfig> config) : base(config.CurrentValue, ExternalType.Google) { }
}
