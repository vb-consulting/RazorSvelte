namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string SignInGitHubUrl = "/signin-github";
}

public class SigninGitHub : ExternalLoginPartial
{
    public SigninGitHub(IOptionsMonitor<GitHubConfig> config) : base(config.CurrentValue, ExternalType.GitHub) { }
}

