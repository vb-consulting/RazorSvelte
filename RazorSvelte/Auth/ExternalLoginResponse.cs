namespace RazorSvelte.Auth;

public class ExternalLoginResponse
{
    private readonly string? error;

    public string? Email { get; init; }
    public string? Name { get; init; }
    public ExternalType Type { get; init; }
    public string? Data { get; init; }
    public string? Timezone { get; init; }
    public DateTime Timestamp { get; } = DateTime.Now;
    public string? Error
    {
        get => error;
        init
        {
            error = value;
            HasError = true;
        }
    }

    public bool HasError { get; private set; } = false;
}