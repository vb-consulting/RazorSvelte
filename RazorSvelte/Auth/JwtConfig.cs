namespace RazorSvelte.Auth;

public class JwtConfig
{
    public string? Secret { get; init; }
    public string? Issuer { get; init; }
    public string? Audience { get; init; }
    public uint? ExpirationMin { get; init; }
    public uint? ClockSkewMin { get; init; }
    public uint? RefreshTokenExpirationMin { get; init; }
    public uint? CookieExpirationMin { get; init; }
    public uint? CookieExpirationMinValue { get; init; }
    public string? CookieName { get; init; }
}
