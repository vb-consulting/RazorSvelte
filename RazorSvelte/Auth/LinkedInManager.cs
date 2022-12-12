namespace RazorSvelte.Auth;

public class LinkedInManager : ExternalLoginManager
{
    public LinkedInManager(IOptionsMonitor<LinkedInConfig> config, HttpClient httpClient) :
        base(config.CurrentValue, httpClient, ExternalType.Google)
    {
    }

    public override async ValueTask<ExternalLoginResponse> ProcessAsync(IDictionary<string, string> parameters, HttpRequest webRequest)
    {
        var (json, jsonContent) = await GetAuthProfileAsync(parameters, webRequest);
        var name = $"{json["localizedFirstName"]} {json["localizedLastName"]}".Trim();

        if (Config.EmailUrl is null)
        {
            return EmailError();
        }

        var (emailJson, emailJsonContent) = await ApiGetRequest(Config.EmailUrl);
        var email = emailJson?["elements"]?[0]?["handle~"]?["emailAddress"]?.ToString();
        if (string.IsNullOrEmpty(email))
        {
            return EmailError();
        }
        return new ExternalLoginResponse
        {
            Email = email,
            Name = name,
            Type = ExternalType.LinkedIn,
            Data = $"{{\"data\":{jsonContent},\"email\":{emailJsonContent}}}",
            Timezone = parameters["timezone"]
        };

        static ExternalLoginResponse EmailError() => new() { Error = $"The email couldn't be retrieved from {ExternalType.LinkedIn}. Try a different provider or use a password." };
    }
}

