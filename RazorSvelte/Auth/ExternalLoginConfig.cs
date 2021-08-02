namespace RazorSvelte.Auth
{
    public abstract class ExternalLoginConfig
    {
        public string ClientId { get; init; }
        public string ClientSecret { get; init; }
        public string RedirectPath { get; init; }
        public string AuthUrl { get; init; }
        public string TokenUrl { get; init; }
        public string InfoUrl { get; init; }
        public string EmailUrl { get; init; }
        public string LoginUrl { get; init; }
    }

    public class LinkedInConfig : ExternalLoginConfig { }

    public class GoogleConfig : ExternalLoginConfig { }

    public class GitHubConfig : ExternalLoginConfig { }

    public enum ExternalType { Google, LinkedIn, GitHub }
}
