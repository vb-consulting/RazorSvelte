using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Microsoft.Extensions.Options;

namespace RazorSvelte.Auth
{
    public class GoogleManager : ExternalLoginManager
    {
        public GoogleManager(IOptionsMonitor<GoogleConfig> config, HttpClient httpClient) :
            base(config.CurrentValue, httpClient, ExternalType.Google)
        {
        }
    }
}
