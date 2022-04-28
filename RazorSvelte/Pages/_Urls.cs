using Newtonsoft.Json;

namespace RazorSvelte.Pages;

public class Urls
{
    [JsonProperty] public const string AuthorizedUrl = "/authorized";
    [JsonProperty] public const string IndexUrl = "/";
    public const string ErrorUrl = "/error";
    [JsonProperty] public const string LoginUrl = "/login";
    [JsonProperty] public const string LogoutUrl = "/logout";
    [JsonProperty] public const string PrivacyUrl = "/privacy";
    [JsonProperty] public const string SpaUrl = "/spa";
    [JsonProperty] public const string OffcanvasNavUrl = "/offcanvas-nav";
    public const string NotFoundUrl = "/404";
    public const string UnathorizedUrl = "/401";
    [JsonProperty] public const string SignInGoogleUrl = "/signin-google";
    [JsonProperty] public const string SignInLinkedInUrl = "/signin-linkedin";
    [JsonProperty] public const string SignInGitHubUrl = "/signin-github";

    public static string Json { get; private set; }

    static Urls()
    {
        Json = JsonConvert.SerializeObject(new Urls());
    }
}
