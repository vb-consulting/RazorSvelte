namespace RazorSvelte.SampleData;

public class ChartSeries
{
    public string? Label { get; set; } = null;
    public int[] Data { get; set; } = default!;
}

public class Chart
{
    public string[] Labels { get; set; } = default!;
    public ChartSeries[] Series { get; set; } = default!;
}