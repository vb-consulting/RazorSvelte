namespace RazorSvelte.Auth;

public class GitHubConfig : ExternalLoginConfig
{
    public GitHubConfig()
    {
        RedirectPath = Consts.SignInGitHubUrl;
        LoginUrl = Consts.LoginGitHubUrl;
    }
}
