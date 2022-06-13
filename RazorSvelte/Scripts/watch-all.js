const fs = require("fs");
const path = require("path");
const cp = require('child_process');

const exec = cmd => new Promise(resolve => {
    let exec = cp.exec(cmd);
    exec.stdout.on("data", data => { if (data) { console.log(data); } });
    exec.stderr.on("data", data => { if (data) { console.error(data); } });
    exec.on("exit", () => resolve());
});

const getAllConfigs = function (dir, result) {
    let files = fs.readdirSync(dir)
    result = result || [];

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            result = getAllConfigs(path.join(dir, file), result)
        } else {
            if (file.endsWith(".rollup.config.js")) {
                result.push("./" + path.join(dir, file).replace(/[\\/]/g, "/"));
            }
        }
    })

    return result;
}

const promises = [];
const build = "./wwwroot/build/";

if (!fs.existsSync(build)) {
    console.log("Creating dir " + build + " ...");
    fs.mkdirSync(build);
}

promises.push(exec(`npm run fe-scss-dark-watch`));
promises.push(exec(`npm run fe-scss-light-watch`));

for (let config of getAllConfigs("./Pages")) {
    promises.push(exec("rollup -c " + config + " -w"));
}

console.log("Watching all...");
