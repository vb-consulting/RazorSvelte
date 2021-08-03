using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RazorSvelte.Auth
{
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

            var (emailJson, _) = await ApiGetRequest(Config.EmailUrl);
            var email = (string)emailJson.SelectToken("$.elements[0].handle~")?["emailAddress"];
            if (string.IsNullOrEmpty(email))
            {
                return new ExternalLoginResponse
                {
                    Error = $"The email couldn't be retrieved from {ExternalType.LinkedIn}. Try a different provider or use a password."
                };
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
        }
    }
}
