using Newtonsoft.Json;

namespace RazorSvelte
{
    public class Urls
    {
        
        [JsonProperty] public const string IndexUrl = "/";
        public const string NotFoundUrl = "/404";
        
        public static string Json { get; private set; }

        static Urls()
        {
            Json = JsonConvert.SerializeObject(new Urls());
        }
    }
}
