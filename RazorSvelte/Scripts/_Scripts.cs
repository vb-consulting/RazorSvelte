#if DEBUG
using System.Reflection;
using System.Text;

namespace RazorSvelte.Scripts;

public static class Scripts
{
    private static bool IsNullable(this Type type) => type == typeof(string) || type.IsClass || type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>);
    
    private static bool IsDict(this Type type) => type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Dictionary<,>);
    
    private static bool IsList(this Type type) => type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>);
    
    private static string ToTsType(this Type? type) => type switch
    {
        { } when type == typeof(string) => "string",
        { } when type == typeof(List<string>) => "string[]",
        { } when type == typeof(string[]) => "string[]",
        { } when type == typeof(int[]) => "number[]",
        { } when type == typeof(int) || type == typeof(int?) => "number",
        { } when type == typeof(bool) || type == typeof(bool?) => "boolean",
        { } when type.IsList() => $"I{type.GenericTypeArguments?.FirstOrDefault()?.ToTsType()}[]",
        { } when type.IsDict() => $"Record<{type.GenericTypeArguments?.FirstOrDefault()?.ToTsType()}, {type.GenericTypeArguments?.LastOrDefault()?.ToTsType()}>",
        { IsEnum: true } => "string",
        { IsClass: true } => $"I{type.Name}",
        _ => "any"
    };

    private static IConfigurationRoot GetConfiguration() => new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", false, false)
        .AddJsonFile("appsettings.Development.json", false, false)
        .Build();

    public static bool BuildUrls(string[] args)
    {
        if (args is not ["build-urls"])
        {
            return false;
        }

        const string tab = "    ";

        var config = GetConfiguration();

        var filePath = config.GetValue<string>("UrlBuilderPath") ?? "./App/shared/urls.ts";

        StringBuilder sb = new();
        sb.AppendLine("/* auto generated */");
        sb.AppendLine("/* eslint-disable @typescript-eslint/no-explicit-any */");
        sb.AppendLine();
        sb.AppendLine("export default {");

        foreach (var fieldInfo in typeof(Pages.Urls).GetFields(BindingFlags.Public | BindingFlags.Static))
        {
            var name = char.ToLower(fieldInfo.Name[0]) + fieldInfo.Name[1..];
            sb.AppendLine($"{tab}{name}: \"{fieldInfo?.GetValue(null)?.ToString()}\",");
        }
        sb.AppendLine();
        sb.AppendLine($"{tab}// endpoints");
        foreach (var endpointType in AppBuilder.EndpointTypes)
        {
            var instance = Activator.CreateInstance(endpointType);
            foreach (var fieldInfo in endpointType.GetFields())
            {
                var name = char.ToLower(fieldInfo.Name[0]) + fieldInfo.Name[1..];
                sb.AppendLine($"    {name}: \"{fieldInfo?.GetValue(instance)?.ToString()}\",");
            }
        }

        sb.AppendLine("}");
        File.WriteAllText(filePath, sb.ToString());
        Console.WriteLine($"{filePath} written successfully");
        return true;
    }

    public static bool BuildModels(string[] args)
    {
        if (args is not ["build-models"])
        {
            return false;
        }

        var config = GetConfiguration();

        var filePath = config.GetValue<string>("TsModelsFilePath");
        if (filePath is null)
        {
            Console.WriteLine("ERROR: TsModelsFilePath is not set.");
            return true;
        }
        var modelNamespace = config.GetValue<string>("ModelNamespace");

        StringBuilder sb = new();
        sb.AppendLine("/* auto generated */");
        sb.AppendLine("/* eslint-disable @typescript-eslint/no-explicit-any */");

        foreach (var configClass in Assembly.Load(modelNamespace?.Split('.')[0] ?? "")
            .GetTypes()
            .Where(t => string.Equals(t.Namespace, modelNamespace, StringComparison.Ordinal)) ?? Enumerable.Empty<Type>())
        {
            if (configClass is { IsAbstract: true, IsSealed: true } || (configClass.IsNotPublic))
            {
                continue;
            }

            sb.AppendLine();
            sb.AppendLine($"interface I{configClass.Name} {{");

            foreach (var prop in configClass.GetProperties())
            {
                var type = prop.PropertyType.ToTsType();
                var nullable = prop.PropertyType.IsNullable();
                var name = string.Concat(prop.Name[0].ToString().ToLower(), prop.Name[1..]);
                sb.AppendLine($"    {name}{(nullable ? "?" : "")}: {type};");
            }
            sb.AppendLine("}");
        }

        File.WriteAllText(filePath, sb.ToString());
        Console.WriteLine($"{filePath} written successfully");
        return true;
    }
}
#endif