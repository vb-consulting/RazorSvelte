namespace RazorSvelte.Auth;

public class GoogleManager : ExternalLoginManager
{
    public GoogleManager(IOptionsMonitor<GoogleConfig> config, HttpClient httpClient) :
        base(config.CurrentValue, httpClient, ExternalType.Google)
    {
    }
}
