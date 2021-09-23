namespace RazorSvelte.Pages._ExternalLogin;

public class SigninGitHubModel : ExternalLoginModel
{
    public SigninGitHubModel(IOptionsMonitor<GitHubConfig> config) : base(config.CurrentValue, ExternalType.GitHub) { }
}

