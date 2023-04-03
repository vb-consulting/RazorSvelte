using Microsoft.AspNetCore.Mvc;
using RazorSvelte.SampleData;

namespace RazorSvelte.Endpoints;

public class CountryEndpoints
{
    // ReSharper disable MemberCanBePrivate.Global
    public const string CountriesUrl = $"{Consts.ApiSegment}/countries";
    public const string SearchCountriesUrl = $"{Consts.ApiSegment}/search-countries";
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

        app.MapGet(SearchCountriesUrl, (
            [FromQuery] string? search,
            [FromQuery] int skip,
            [FromQuery] int take) =>
        {
            var json = File.ReadAllText("./SampleData/countries.json");
            
            var result = json?.Deserialize<Country[]>()?
                .Where(c => string.IsNullOrEmpty(search) || 
                    c?.Culture?.Contains(search, StringComparison.OrdinalIgnoreCase) == true ||
                    c?.Iso2?.Contains(search, StringComparison.OrdinalIgnoreCase) == true ||
                    c?.Iso3?.Contains(search, StringComparison.OrdinalIgnoreCase) == true ||
                    c?.Name?.Contains(search, StringComparison.OrdinalIgnoreCase) == true ||
                    c?.Code.ToString().Contains(search, StringComparison.OrdinalIgnoreCase) == true)
                .ToArray();

            return new
            {
                count = result?.Length ?? 0,
                page = result?.Skip(skip).Take(take).ToArray() ?? Array.Empty<Country>()
            };
        });
    }
}
