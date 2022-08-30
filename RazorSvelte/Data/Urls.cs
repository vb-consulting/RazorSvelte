using Newtonsoft.Json;

namespace RazorSvelte;

public partial class Urls
{
    [JsonProperty] public const string Chart1Url = "api/chart/1";
    [JsonProperty] public const string Chart2Url = "api/chart/2";
    [JsonProperty] public const string Chart3Url = "api/chart/3";
}
