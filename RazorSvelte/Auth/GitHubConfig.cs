namespace RazorSvelte.Auth;

public class GitHubConfig : ExternalLoginConfig
{
    public GitHubConfig()
    {
        RedirectPath = Urls.SignInGitHubUrl;
        LoginUrl = Urls.LoginGitHubUrl;
    }
}
