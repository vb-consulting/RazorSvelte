namespace RazorSvelte.Auth;

public class GitHubManager : ExternalLoginManager
{
    public GitHubManager(IOptionsMonitor<GitHubConfig> config, HttpClient httpClient) :
        base(config.CurrentValue, httpClient, ExternalType.Google)
    {
    }
}
