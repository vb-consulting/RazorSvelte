using System.Reflection;
using System.Text;

namespace RazorSvelte.Scripts
{
    public static class UrlBuilder
    {
        public static bool Build(string[] args)
        {
            if (!(args.Length == 1 && args[0] == "build-urls"))
            {
                return false;
            }

            const string header = "/*auto generated*/";
            const string tab = "    ";

            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", false, false)
                .AddJsonFile("appsettings.Development.json", false, false)
                .Build();

            var filePath = config.GetValue<string>("UrlBuilderPath") ?? "./App/shared/urls.ts";

            StringBuilder sb = new();
            sb.AppendLine(header);
            sb.AppendLine("export default {");

            foreach (var fieldInfo in typeof(Pages.Urls).GetFields(BindingFlags.Public | BindingFlags.Static))
            {
                string name = char.ToLower(fieldInfo.Name[0]) + fieldInfo.Name[1..];
                sb.AppendLine($"{tab}{name}: \"{fieldInfo?.GetValue(null)?.ToString()}\",");
            }
            sb.AppendLine();
            sb.AppendLine($"{tab}// endpoints");
            foreach (var endpointType in AppBuilder.EndpointTypes)
            {
                var instance = Activator.CreateInstance(endpointType);
                foreach (var fieldInfo in endpointType.GetFields())
                {
                    string name = char.ToLower(fieldInfo.Name[0]) + fieldInfo.Name[1..];
                    sb.AppendLine($"    {name}: \"{fieldInfo?.GetValue(instance)?.ToString()}\",");
                }
            }

            sb.AppendLine("}");
            File.WriteAllText(filePath, sb.ToString());
            Console.WriteLine($"{filePath} written successfully");
            return true;
        }
    }
}
