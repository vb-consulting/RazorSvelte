namespace RazorSvelte.Pages._ExternalLogin;

public class SigninLinkedInModel : ExternalLoginModel
{
    public SigninLinkedInModel(IOptionsMonitor<LinkedInConfig> config) : base(config.CurrentValue, ExternalType.LinkedIn) { }
}

