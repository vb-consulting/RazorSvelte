namespace RazorSvelte.Auth
{
    public class JwtConfig
    {
        public string Secret { get; init; }
        public string Issuer { get; init; }
        public string Audience { get; init; }
        public int? ExpirationMin { get; init; }
        public double CookieExpirationMin { get; init; }
        public string CookieName { get; init; }
    }
}
