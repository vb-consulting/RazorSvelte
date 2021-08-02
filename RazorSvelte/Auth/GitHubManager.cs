using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Microsoft.Extensions.Options;

namespace RazorSvelte.Auth
{
    public class GitHubManager : ExternalLoginManager
    {
        public GitHubManager(IOptionsMonitor<GitHubConfig> config, HttpClient httpClient) :
            base(config.CurrentValue, httpClient, ExternalType.Google)
        {
        }
    }
}
