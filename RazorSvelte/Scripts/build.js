const fs = require("fs");
const path = require("path");
const cp = require('child_process');

const args = process.argv.slice(2);
let page = "index";
let watch = false;
if (args.length) {
    for (let arg of args) {
        let lower = arg.toLowerCase();
        if (!watch && lower == "-w" || lower == "--watch" || lower == "-watch") {
            watch = true;
        }
        if (page == "index" && !lower.startsWith("-")) {
            page = lower;
        }
    }
}

console.log(`${(watch ? "Watching" : "Building")} ${page}...`);

const exec = cmd => new Promise(resolve => {
    console.log(cmd);
    let exec = cp.exec(cmd);
    exec.stdout.on("data", data => { if (data) { console.log(data); } });
    exec.stderr.on("data", data => { if (data) { console.error(data); } });
    exec.on("exit", () => resolve());
});

const getAllConfigs = function (dir, result) {
    let files = fs.readdirSync(dir)
    result = result || {};

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            result = getAllConfigs(path.join(dir, file), result)
        } else {
            if (file.endsWith(".rollup.config.js")) {
                result[file.replace(".rollup.config.js", "").toLowerCase()] = "./" + path.join(dir, file).replace(/[\\/]/g, "/");
            }
        }
    })

    return result;
}
const configs = getAllConfigs("./Pages")
const config = configs[page];
if (!config) {
    console.error(`ERROR: Could not find page '${page}'`);
    return;
}

console.log(`Config found: '${config}'`);
exec("npx rollup -c " + config + (watch ? " -w" : "") +" --bundleConfigAsCjs");
