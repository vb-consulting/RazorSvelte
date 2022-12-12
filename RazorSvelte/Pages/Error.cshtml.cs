using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string ErrorUrl = "/error";
}

[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
[IgnoreAntiforgeryToken]
public class ErrorModel : PageModel
{
    public string? RequestId { get; set; }

    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

    public void OnGet()
    {
        RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
    }
}
