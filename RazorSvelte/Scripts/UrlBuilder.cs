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

            const string filePath = "./App/shared/urls.ts";
            StringBuilder sb = new();
            sb.AppendLine("/*auto generated*/");
            sb.AppendLine("export default {");

            foreach (var fieldInfo in typeof(Pages.Urls).GetFields(BindingFlags.Public | BindingFlags.Static))
            {
                string name = char.ToLower(fieldInfo.Name[0]) + fieldInfo.Name[1..];
                sb.AppendLine($"    {name}: \"{fieldInfo?.GetValue(null)?.ToString()}\",");
            }
            sb.AppendLine();
            foreach (var fieldInfo in typeof(Endpoints.Urls).GetFields(BindingFlags.Public | BindingFlags.Static))
            {
                string name = char.ToLower(fieldInfo.Name[0]) + fieldInfo.Name[1..];
                sb.AppendLine($"    {name}: \"{fieldInfo?.GetValue(null)?.ToString()}\",");
            }

            sb.AppendLine("}");
            File.WriteAllText(filePath, sb.ToString());
            Console.WriteLine($"{filePath} written successfully");
            return true;
        }
    }
}
