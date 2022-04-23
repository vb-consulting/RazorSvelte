namespace RazorSvelte.Auth.Pages;

public class SigninLinkedIn : ExternalLoginPartial
{
    public SigninLinkedIn(IOptionsMonitor<LinkedInConfig> config) : base(config.CurrentValue, ExternalType.LinkedIn) { }
}
