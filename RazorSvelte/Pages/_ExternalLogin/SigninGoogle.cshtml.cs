namespace RazorSvelte.Pages._ExternalLogin;

public class SigninGoogleModel : ExternalLoginModel
{
    public SigninGoogleModel(IOptionsMonitor<GoogleConfig> config) : base(config.CurrentValue, ExternalType.Google) { }
}
