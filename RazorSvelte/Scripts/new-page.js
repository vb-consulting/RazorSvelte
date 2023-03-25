const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require('child_process');
const readline = require("readline");
const promises = require("fs/promises");
const config = require(`./config`);

const currDir = process.cwd().endsWith(config.scriptsDirName);

const readlineInputInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
const pagePath = (currDir ? ".." : ".") + config.pagePath;
const appPath = (currDir ? ".." : ".") + config.appPath;
const rootPath = (currDir ? ".." : ".") + "/";
const layoutFile = (currDir ? ".." : ".") + config.layoutFilePath;
var csproj = null;

const exec = cmd => new Promise(resolve => {
    console.log(cmd);
    let exec = cp.exec(cmd);
    exec.stdout.on("data", data => { if (data) { console.log(data); } });
    exec.stderr.on("data", data => { if (data) { console.error(data); } });
    exec.on("exit", () => { resolve(); return 0; });
});

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

    const cshtml = pagePath + name + config.cshtmlExt;
    const cs = pagePath + name + config.csExt;
    const entry = pagePath + name + config.entryExt;
    const rollup = pagePath + name + config.rollupExt;
    const svelte = appPath + nameLower + config.svelteExt;

    const url = "/" + nameLower;
    var urlKey = name + "Url";


    for (const file of await promises.readdir(rootPath)) {
        if (file.endsWith(config.csprojExt)) {
            csproj = rootPath + file;
        }
    }

    var namespace = config.defaultNamespace;
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

public partial class Urls
{
    public const string  ${urlKey} = "${url}";
}

public class ${name}Model : PageModel {}
`);
        console.log(`File created: ${cs}`);
    }

    if (!fs.existsSync(entry)) {
        fs.writeFileSync(entry, `/// <reference types="svelte" />
import App from "../App/${nameLower}.svelte";
import init from "../App/shared/init";
export default new App({target: document.body, props: init("${name}") ?? {}});
`);
        console.log(`File created: ${entry}`);
    }

    if (!fs.existsSync(rollup)) {
        fs.writeFileSync(rollup, `import config from "../${config.scriptsDirName}/rollup.config";
export default config("./Pages/${name}.entry.ts");
`);
        console.log(`File created: ${rollup}`);
    }

    if (fs.existsSync(csproj)) {
        var existingLines = await getLines(csproj, `<None Update="Pages\\${name}${config.rollupExt}">`);
        if (existingLines && existingLines.length) {
            var lines = [];
            var nestingAdded = false;
            for await (const line of getFileStream(csproj)) {
                if (line.indexOf(`<ItemGroup Label="nesting">`) > -1 && !nestingAdded) {
                    lines.push(line);
                    lines.push(`		<None Update="Pages\\${name}${config.rollupExt}">`);
                    lines.push(`			<DependentUpon>${name}${config.cshtmlExt}</DependentUpon>`);
                    lines.push(`		</None >`);
                    lines.push(`		<None Update="Pages\\${name}${config.entryExt}">`);
                    lines.push(`			<DependentUpon>${name}${config.cshtmlExt}</DependentUpon>`);
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
    import Layout from "$shared/layout.svelte";
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
</style> 
`);
        console.log(`File created: ${svelte}`);
    }

    if (fs.existsSync(layoutFile)) {
        const urlTsKey = name.charAt(0).toLowerCase() + name.slice(1) + "Url";
        var existingLines = await getLines(layoutFile, `href="{urls.${urlTsKey}Url}`);
        if (existingLines && existingLines.length) {

            existingLines.push(`<li class={classes}>`);
            existingLines.push(`    <a`);
            existingLines.push(`        class={anchorClass}`);
            existingLines.push(`        class:active={document.location.pathname == urls.${urlTsKey}}`);
            existingLines.push(`        href="{urls.${urlTsKey}}">${name}</a>`);
            existingLines.push(`</li>`);

            fs.writeFileSync(layoutFile, existingLines.join(os.EOL));
            console.log(`Added list item to file: '${layoutFile}'`);

        }
    }

    exec('npm run build-urls').then(() => exec('npm run fe-build ' + nameLower));
});

