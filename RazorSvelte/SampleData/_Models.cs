using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RazorSvelte.SampleData;

public static class Extensions
{
    private static readonly JsonSerializerOptions SerializerOptions = new() { PropertyNameCaseInsensitive = true };

    public static T? Deserialize<T>(this string json) => JsonSerializer.Deserialize<T>(json, SerializerOptions);
}

internal class ChartSeries
{
    public string? Label { get; set; } = null;
    public int[] Data { get; set; } = default!;
}

internal class Chart
{
    public string[] Labels { get; set; } = default!;
    public ChartSeries[] Series { get; set; } = default!;
}

public class Country
{
    public int Code { get; set; } = default!;
    public string Iso2 { get; set; } = default!;
    public string Iso3 { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Culture { get; set; } = default!;
    public DateTime Timestamp { get; set; } = default!;
}
