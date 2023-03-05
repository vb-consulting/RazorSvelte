const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const readline = require("readline");
const config = require(`./config`);

const rollupExt = config.rollupExt;
const pagesDir = config.pagesDir;
const rollupExtraArgs = config.rollupExtraArgs;

function run(page, watch) {
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
                if (file.endsWith(rollupExt)) {
                    result[file.replace(rollupExt, "").toLowerCase()] = "./" + path.join(dir, file).replace(/[\\/]/g, "/");
                }
            }
        })

        return result;
    }
    const configs = getAllConfigs(pagesDir);
    const config = configs[page];
    if (!config) {
        console.error(`ERROR: Could not find page '${page}'`);
        return;
    }

    //console.log(`Config found: '${config}'`);
    exec("npx rollup -c " + config + (watch ? " -w" : "") + rollupExtraArgs);
}

const args = process.argv.slice(2);
let page = "";
let watch = false;
if (args.length) {
    for (let arg of args) {
        let lower = arg.toLowerCase();
        if (lower == "-w" || lower == "--watch" || lower == "-watch") {
            watch = true;
        } else {
            page = lower;
        }
    }
}

if (page) {
    run(page, watch);
} else {
    const readlineInputInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
    readlineInputInterface.question(`Enter new page name: `, async name => {
        readlineInputInterface.close();
        if (/[\/\\:*?"<>]/g.test(name)) {
            console.error(`ERROR: File name '${name}' is not valid!`);
            return;
        }
        run(name.toLowerCase(), watch);
    });
};
