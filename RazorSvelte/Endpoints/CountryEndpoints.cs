using RazorSvelte.SampleData;

namespace RazorSvelte.Endpoints;

public class CountryEndpoints
{
    public const string CountriesUrl = $"{Consts.ApiSegment}/countries";

    public static void UseEndpoints(WebApplication app)
    {
        app.MapGet(CountriesUrl, () =>
        {
            var json = File.ReadAllText("./SampleData/countries.json");
            return json.Deserialize<Country[]>();
        });
    }
}
