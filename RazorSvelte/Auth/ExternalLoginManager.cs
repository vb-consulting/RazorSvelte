using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;

namespace RazorSvelte.Auth;

public abstract class ExternalLoginManager
{
    protected readonly ExternalLoginConfig Config;
    private readonly HttpClient httpClient;
    private readonly ExternalType type;
    private static readonly string Agent = $"{Guid.NewGuid().ToString()[..8]}";

    private string? token;

    protected ExternalLoginManager(ExternalLoginConfig config, HttpClient httpClient, ExternalType type)
    {
        Config = config;
        this.httpClient = httpClient;
        this.type = type;
    }

    public virtual async ValueTask<ExternalLoginResponse> ProcessAsync(IDictionary<string, string> parameters, HttpRequest webRequest)
    {
        var (json, content) = await GetAuthProfileAsync(parameters, webRequest);
        if (json == null)
        {
            return new ExternalLoginResponse
            {
                Error = $"Profile JSON is malformed."
            };
        }
        var emailToken = json["email"];
        var nameToken = json["name"];
        if (emailToken is null)
        {
            return EmailError();
        }
        if (nameToken is null)
        {
            return NameError();
        }

        var email = (string?)emailToken;
        if (string.IsNullOrEmpty(email))
        {
            return EmailError();
        }
        return new ExternalLoginResponse
        {
            Email = email,
            Name = (string?)nameToken,
            Type = type,
            Data = content,
            Timezone = parameters["timezone"]
        };

        ExternalLoginResponse EmailError() => new() { Error = $"The email couldn't be retrieved from {type}. Try a different provider or use a password." };
        ExternalLoginResponse NameError() => new() { Error = $"The name couldn't be retrieved from {type}. Try a different provider or use a password." };
    }

    protected async ValueTask<(JObject json, string content)> GetAuthProfileAsync(IDictionary<string, string> parameters, HttpRequest webRequest)
    {
        if (!parameters.TryGetValue("code", out var code))
        {
            throw new HttpRequestException($"Authorization code is missing. Parameters: {JsonConvert.SerializeObject(parameters)}");
        }
        if (Config.InfoUrl is null)
        {
            throw new HttpRequestException($"InfoUrl is not defiend for provider {type}");
        }
        await RetrieveToken(webRequest, code);
        return await ApiGetRequest(Config.InfoUrl);
    }

    protected async ValueTask<(JObject json, string content)> ApiGetRequest(string url)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Headers.UserAgent.ParseAdd(Agent);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        using var infoResponse = await httpClient.SendAsync(request);
        if (!infoResponse.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"User info endpoint {url} returned {infoResponse.StatusCode}");
        }
        var content = await infoResponse.Content.ReadAsStringAsync();
        try
        {
            return (JObject.Parse(content), content);
        }
        catch (JsonReaderException e)
        {
            throw new HttpRequestException(
                $"Invalid JSON response for user info endpoint {url} with message {e.Message}, response: {content}");
        }
    }

    private async ValueTask RetrieveToken(HttpRequest webRequest, string code)
    {
        if (Config.ClientId is null || Config.ClientSecret is null)
        {
            return;
        }
        var redirectUrl = $"{webRequest.Scheme}://{webRequest.Host}{Config.RedirectPath}";
        using var request = new HttpRequestMessage(HttpMethod.Post, Config.TokenUrl);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["redirect_uri"] = redirectUrl,
            ["code"] = code,
            ["client_id"] = Config.ClientId,
            ["client_secret"] = Config.ClientSecret,
            ["grant_type"] = "authorization_code"
        });
        using var response = await httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Token endpoint {Config.TokenUrl} returned {response.StatusCode}");
        }
        var content = await response.Content.ReadAsStringAsync();
        var json = JObject.Parse(content);
        var tokenToken = json["access_token"];
        if (tokenToken is null)
        {
            RaiseTokenError();
        }
        token = (string?)tokenToken;
        if (string.IsNullOrEmpty(token))
        {
            RaiseTokenError();
        }
        void RaiseTokenError() => throw new HttpRequestException($"Token is null or empty! {Config.TokenUrl} returned: {content}");
    }
}

