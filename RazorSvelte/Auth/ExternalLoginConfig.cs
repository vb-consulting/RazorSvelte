namespace RazorSvelte.Auth;

public abstract class ExternalLoginConfig
{
    public string? ClientId { get; init; }
    public string? ClientSecret { get; init; }
    public string? RedirectPath { get; protected set; }
    public string? AuthUrl { get; init; }
    public string? TokenUrl { get; init; }
    public string? InfoUrl { get; init; }
    public string? EmailUrl { get; init; }
    public string? LoginUrl { get; protected set; }
}
