using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RazorSvelte.Auth
{
    public abstract class ExternalLoginManager
    {
        protected readonly ExternalLoginConfig Config;
        private readonly HttpClient httpClient;
        private readonly ExternalType type;
        private static readonly string Agent = $"{Guid.NewGuid().ToString()[..8]}";
        private string token;

        protected ExternalLoginManager(ExternalLoginConfig config, HttpClient httpClient, ExternalType type)
        {
            Config = config;
            this.httpClient = httpClient;
            this.type = type;
        }

        public virtual async ValueTask<ExternalLoginResponse> ProcessAsync(IDictionary<string, string> parameters, HttpRequest webRequest)
        {
            var (json, content) = await GetAuthProfileAsync(parameters, webRequest);
            var email = (string)json["email"];
            if (string.IsNullOrEmpty(email))
            {
                return new ExternalLoginResponse
                {
                    Error = $"The email couldn't be retrieved from {type}. Try a different provider or use a password."
                };
            }
            return new ExternalLoginResponse
            {
                Email = email,
                Name = (string)json["name"],
                Type = type,
                Data = content,
                Timezone = parameters["timezone"]
            };
        }

        protected async ValueTask<(JObject json, string content)> GetAuthProfileAsync(IDictionary<string, string> parameters, HttpRequest webRequest)
        {
            if (!parameters.TryGetValue("code", out var code))
            {
                throw new HttpRequestException($"Authorization code is missing. Parameters: {JsonConvert.SerializeObject(parameters)}");
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
            token = (string)json["access_token"];
            if (string.IsNullOrEmpty(token))
            {
                throw new HttpRequestException($"Token is null or empty! {Config.TokenUrl} returned: {content}");
            }
        }
    }
}
