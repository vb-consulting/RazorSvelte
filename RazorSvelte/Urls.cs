using Newtonsoft.Json;

namespace RazorSvelte
{
    public class Urls
    {
        [JsonProperty] public const string AuthorizedUrl = "/authorized";
        [JsonProperty] public const string IndexUrl = "/";
        [JsonProperty] public const string LoginUrl = "/login";
        [JsonProperty] public const string LogoutUrl = "/logout";
        public const string NotFoundUrl = "/404";
        [JsonProperty] public const string PrivacyUrl = "/privacy";
        public const string UnathorizedUrl = "/401";
        [JsonProperty] public const string SignInGoogleUrl = "/signin-google";
        [JsonProperty] public const string SignInLinkedInUrl = "/signin-linkedin";
        [JsonProperty] public const string SignInGitHubUrl = "/signin-github";
        public const string LoginGoogleUrl = "/api/google-login";
        public const string LoginLinkedInUrl = "/api/linkedin-login";
        public const string LoginGitHubUrl = "/api/github-login";
    }
}
