using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using RazorSvelte.SampleData;

namespace RazorSvelte.Endpoints;

public class CountryEndpoints
{
    // ReSharper disable MemberCanBePrivate.Global
    public const string CountriesUrl = $"{Consts.ApiSegment}/countries";
    // ReSharper restore MemberCanBePrivate.Global

    public static void UseEndpoints(WebApplication app)
    {
        app.MapGet(CountriesUrl, (
            [FromQuery(Name = "culture-contains")] 
            string? cultureContains,
            [FromQuery] int? limit) =>
        {
            var json = File.ReadAllText("./SampleData/countries.json");

            return json?.Deserialize<Country[]>()?
                .Where(c => string.IsNullOrEmpty(cultureContains) || c?.Culture?.Contains(cultureContains, StringComparison.OrdinalIgnoreCase) == true)
                .Select(c => 
                {
                    c.Timestamp = DateTime.Now;
                    return c;
                })
                .OrderByDescending(c => c.Code)
                .Take(limit ?? int.MaxValue);
        });
    }
}
