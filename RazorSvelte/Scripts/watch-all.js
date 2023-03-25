const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const config = require(`./config`);

const build = config.build;
const rollupExt = config.rollupExt;
const pagesDir = config.pagesDir;
const rollupExtraArgs = config.rollupExtraArgs;

const exec = cmd => new Promise(resolve => {
    console.log(cmd);
    let exec = cp.exec(cmd);
    exec.stdout.on("data", data => { if (data) { console.log(data); } });
    exec.stderr.on("data", data => { if (data) { console.error(data); } });
    exec.on("exit", () => { resolve(); return 0; });
});

const getAllConfigs = function (dir, result) {
    let files = fs.readdirSync(dir)
    result = result || [];

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            result = getAllConfigs(path.join(dir, file), result)
        } else {
            if (file.endsWith(rollupExt)) {
                result.push("./" + path.join(dir, file).replace(/[\\/]/g, "/"));
            }
        }
    })

    return result;
}

const promises = [];

if (!fs.existsSync(build)) {
    console.log("Creating dir " + build + " ...");
    fs.mkdirSync(build);
} else {
    for (let file of fs.readdirSync(build)) {
        if (file.endsWith(".map")) {
            var name = (build + "/" + file).replace("//", "/");
            console.log("removing ", name);
            try {
                fs.unlinkSync(name)
                //file removed
            } catch (err) {
                console.error(err)
            }
        }
    }
}

promises.push(exec(`npm run fe-scss-watch`));

for (let config of getAllConfigs(pagesDir)) {
    promises.push(exec("npx rollup -c " + config + " -w" + rollupExtraArgs));
}

console.log("Watching all...");
