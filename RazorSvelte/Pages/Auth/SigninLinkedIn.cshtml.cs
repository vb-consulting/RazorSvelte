namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string SignInLinkedInUrl = "/signin-linkedin";
}

public class SigninLinkedIn : ExternalLoginPartial
{
    public SigninLinkedIn(IOptionsMonitor<LinkedInConfig> config) : base(config.CurrentValue, ExternalType.LinkedIn) { }
}
