using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace RazorSvelte;

public static class Extensions
{
    public static string AppendCacheBusterVersion(this IRazorPage page, string path)
    {
        var context = page.ViewContext.HttpContext;
        var fileVersionProvider = context.RequestServices.GetRequiredService<IFileVersionProvider>();
        return fileVersionProvider.AddFileVersionToPath(context.Request.PathBase, path);
    }
}
