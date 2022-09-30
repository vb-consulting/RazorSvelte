const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const promises = require("fs/promises");

const currDir = process.cwd().endsWith("Scripts");

const readlineInputInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
const pagePath = (currDir ? ".." : ".") + "/Pages/";
const urlsFile = (currDir ? ".." : ".") + "/Pages/_Urls.cs";
const appPath = (currDir ? ".." : ".") + "/App/";
const rootPath = (currDir ? ".." : ".") + "/";
const configFile = (currDir ? ".." : ".") + "/App/shared/config.ts";
const layoutFile = (currDir ? ".." : ".") + "/App/shared/layout/link-list-items.svelte";
var csproj = null;

readlineInputInterface.question(`Enter new page name: `, async name => {

    readlineInputInterface.close();
    if (/[\/\\:*?"<>]/g.test(name)) {
        console.error(`ERROR: File name '${name}' is not valid!`);
        return;
    }

    function getFileStream(name) {
        return rl = readline.createInterface({
            input: fs.createReadStream(name),
            crlfDelay: Infinity
        });
    }

    async function getLines(name, pattern) {
        var lines = [];
        for await (const line of getFileStream(name)) {
            if (pattern && line.indexOf(pattern) > -1) {
                return null;
            }
            lines.push(line);
        }
        return lines;
    }

    const nameLower = name.toLowerCase();

    const cshtml = pagePath + name + ".cshtml";
    const cs = pagePath + name + ".cshtml.cs";
    const entry = pagePath + name + ".entry.ts";
    const rollup = pagePath + name + ".rollup.config.js";
    const svelte = appPath + nameLower + ".svelte";

    const url = "/" + nameLower;
    var urlKey = null;

    if (fs.existsSync(urlsFile)) {
        var existingLines = await getLines(urlsFile, `[JsonProperty] public const string ${name}Url = "${url}";`);
        if (existingLines && existingLines.length) {
            var lines = [];
            var pattern = "[JsonProperty] public const string ";
            for await (const line of existingLines) {
                var idx = line.indexOf(pattern);
                if (idx > -1 && !urlKey) {
                    urlKey = name + "Url";
                    lines.push(line.substr(0, idx + pattern.length) + urlKey + ` = "${url}";`);
                }
                lines.push(line);
            }

            if (urlKey) {
                fs.writeFileSync(urlsFile, lines.join(os.EOL));
                console.log(`Added URL key ${urlKey} = "${url}" to file '${urlsFile}'`);
            }
        }
    }

    for (const file of await promises.readdir(rootPath)) {
        if (file.endsWith(`.csproj`)) {
            csproj = rootPath + file;
        }
    }

    var namespace = "RazorSvelte";
    if (csproj) {
        namespace = path.parse(csproj).name;
    }

    if (!fs.existsSync(cshtml)) {
        fs.writeFileSync(cshtml, `${urlKey == null ? `@page "${url}"` : `@page
@attribute [RazorCompiledItemMetadata("RouteTemplate", Urls.${urlKey})]
`}
@model ${name}Model
@{
    ViewData["Title"] = "${name} Title";
}

@section HeadSection {
    <link href="~/build/${nameLower}.css" asp-append-version="true" rel="stylesheet" />
    <script defer src="~/build/${nameLower}.js" asp-append-version="true"></script>
}
`);
        console.log(`File created: ${cshtml}`);
    }

    if (!fs.existsSync(cs)) {
        fs.writeFileSync(cs, `namespace ${namespace}.Pages;

public class ${name}Model : PageModel {}
`);
        console.log(`File created: ${cs}`);
    }

    if (!fs.existsSync(entry)) {
        fs.writeFileSync(entry, `/// <reference types="svelte" />
import App from "../App/${nameLower}.svelte";
export default new App({target: document.body});
`);
        console.log(`File created: ${entry}`);
    }

    if (!fs.existsSync(rollup)) {
        fs.writeFileSync(rollup, `import config from "../Scripts/rollup.config";
export default config("./Pages/${name}.entry.ts");
`);
        console.log(`File created: ${rollup}`);
    }

    if (fs.existsSync(csproj)) {
        var existingLines = await getLines(csproj, `<None Update="Pages\\${name}.rollup.config.js">`);
        if (existingLines && existingLines.length) {
            var lines = [];
            var nestingAdded = false;
            for await (const line of getFileStream(csproj)) {
                if (line.indexOf(`<ItemGroup Label="nesting">`) > -1 && !nestingAdded) {
                    lines.push(line);
                    lines.push(`		<None Update="Pages\\${name}.rollup.config.js">`);
                    lines.push(`			<DependentUpon>${name}.cshtml</DependentUpon>`);
                    lines.push(`		</None >`);
                    lines.push(`		<None Update="Pages\\${name}.entry.ts">`);
                    lines.push(`			<DependentUpon>${name}.cshtml</DependentUpon>`);
                    lines.push(`		</None>`);
                    nestingAdded = true;
                } else {
                    lines.push(line);
                }
            }

            if (nestingAdded) {
                fs.writeFileSync(csproj, lines.join(os.EOL));
                console.log(`Added new nesting to ${csproj}`);
            }
        }
    }

    if (!fs.existsSync(svelte)) {
        fs.writeFileSync(svelte, `<script lang="ts">
    import Layout from "./shared/layout/default";
</script>

<Layout>
    <div class="container text-center">
        <h1>${name}</h1>
        
        <p>
            Content here
        </p>
    </div>
</Layout>

<style lang="scss">
    .container {
        margin-top: 10%;
    }
</style> 
`);
        console.log(`File created: ${svelte}`);
    }

    if (urlKey) {

        if (fs.existsSync(configFile)) {
            var existingLines = await getLines(configFile, `${nameLower}Url: string;`);
            if (existingLines && existingLines.length) {
                var lines = [];
                var lineAdded = false;
                for await (const line of existingLines) {
  
                    if (line.indexOf(`}>("urls");`) > -1 && !lineAdded) {
                        lineAdded = true;
                        lines.push(`    ${nameLower}Url: string;`);
                        lines.push(line);
                    } else {
                        lines.push(line);
                    }
                }

                if (lineAdded) {
                    fs.writeFileSync(configFile, lines.join(os.EOL));
                    console.log(`Added URL key '${nameLower}Url: string;' to file '${configFile}'`);
                }
            }
        }

        if (fs.existsSync(layoutFile)) {
            var existingLines = await getLines(layoutFile, `href="{urls.${nameLower}Url}`);
            if (existingLines && existingLines.length) {

                existingLines.push(`<li class="nav-item py-0">`);
                existingLines.push(`    <a class="nav-link" class:active={document.location.pathname == urls.${nameLower}Url} href="{urls.${nameLower}Url}">${name}</a>`);
                existingLines.push(`</li>`);

                fs.writeFileSync(layoutFile, existingLines.join(os.EOL));
                console.log(`Added list item to file: '${layoutFile}'`);

            }
        }
    }
});

