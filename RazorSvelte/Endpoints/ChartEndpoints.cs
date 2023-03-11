#pragma warning disable CS8602 // Dereference of a possibly null reference.
using RazorSvelte.SampleData;

namespace RazorSvelte.Endpoints;

public class ChartEndpoints
{
    // ReSharper disable MemberCanBePrivate.Global
    public const string Chart1Url = $"{Consts.ApiSegment}/chart/1";
    public const string Chart2Url = $"{Consts.ApiSegment}/chart/2";
    public const string Chart3Url = $"{Consts.ApiSegment}/chart/3";
    // ReSharper restore MemberCanBePrivate.Global
    
    public static void UseEndpoints(WebApplication app)
    {
        app.MapGet(Chart1Url, GetChart1);
        app.MapGet(Chart2Url, GetChart2);
        app.MapGet(Chart3Url, GetChart3);
    }

    private static Chart GetChart1(HttpResponse response)
    {
        Task.Delay(1000).Wait();
        var json = File.ReadAllText("./SampleData/chart1.json");
        var data = json.Deserialize<Chart>();

        Random random = new();
        data.Series[0].Data[0] = random.Next(20, 100);
        data.Series[1].Data[0] = random.Next(20, 100);
        data.Series[2].Data[0] = random.Next(20, 100);

        data.Series[0].Data[1] = random.Next(10, 30);
        data.Series[1].Data[1] = random.Next(10, 30);
        data.Series[2].Data[1] = random.Next(10, 30);

        return data ?? default!;
    }

    private static Chart GetChart2(HttpResponse response)
    {
        Task.Delay(1000).Wait();
        var json = File.ReadAllText("./SampleData/chart2.json");
        var data = json.Deserialize<Chart>();

        Random random = new();
        data.Series[0].Data[0] = random.Next(100, 1000);
        data.Series[1].Data[0] = random.Next(100, 1000);
        data.Series[2].Data[0] = random.Next(100, 1000);
        data.Series[3].Data[0] = random.Next(100, 1000);
        data.Series[4].Data[0] = random.Next(100, 1000);

        data.Series[0].Data[1] = random.Next(50, 100);
        data.Series[1].Data[2] = random.Next(50, 100);
        data.Series[2].Data[3] = random.Next(50, 100);
        data.Series[3].Data[4] = random.Next(50, 100);
        data.Series[4].Data[5] = random.Next(50, 100);

        return data ?? default!;
    }

    private static Chart GetChart3(HttpResponse response)
    {
        Task.Delay(1000).Wait();
        var json = File.ReadAllText("./SampleData/chart3.json");
        var data = json.Deserialize<Chart>();

        Random random = new();
        data.Series[0].Data[0] = random.Next(100, 1000);

        return data ?? default!;
    }
}
