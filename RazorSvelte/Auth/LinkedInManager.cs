using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RazorSvelte.Auth;

public class LinkedInManager : ExternalLoginManager
{
    public LinkedInManager(IOptionsMonitor<LinkedInConfig> config, HttpClient httpClient) :
        base(config.CurrentValue, httpClient, ExternalType.Google)
    {
    }

    public override async ValueTask<ExternalLoginResponse> ProcessAsync(IDictionary<string, string> parameters, HttpRequest webRequest)
    {
        var (json, _) = await GetAuthProfileAsync(parameters, webRequest);
        var name = $"{json["localizedFirstName"]} {json["localizedLastName"]}".Trim();

        if (Config.EmailUrl is null)
        {
            return EmailError();
        }

        var (emailJson, _) = await ApiGetRequest(Config.EmailUrl);

        var token = emailJson.SelectToken("$.elements[0].handle~")?["emailAddress"];
        if (token is null)
        {
            return EmailError();
        }
        var email = (string?)token;
        if (string.IsNullOrEmpty(email))
        {
            return EmailError();
        }

        json.Merge(emailJson, new JsonMergeSettings
        {
            MergeArrayHandling = MergeArrayHandling.Union
        });

        return new ExternalLoginResponse
        {
            Email = email,
            Name = name,
            Type = ExternalType.LinkedIn,
            Data = JsonConvert.SerializeObject(json),
            Timezone = parameters["timezone"]
        };

        static ExternalLoginResponse EmailError() => new(){ Error = $"The email couldn't be retrieved from {ExternalType.LinkedIn}. Try a different provider or use a password."};
    }
}
