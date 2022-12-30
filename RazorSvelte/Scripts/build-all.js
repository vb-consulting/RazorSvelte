const fs = require("fs");
const path = require("path");
const cp = require('child_process');

const exec = cmd => new Promise(resolve => {
    console.log(cmd);
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

const removeMaps = root => new Promise(resolve => {
    for (let file of fs.readdirSync(root)) {
        if (file.endsWith(".map")) {
            var name = (root + "/" + file).replace("//", "/");
            console.log("removing extra file: ", name);
            try {
                fs.unlinkSync(name)
                //file removed
            } catch (err) {
                console.error(err)
            }
        }
    }
    resolve();
});

const promises = [];
const root = "./wwwroot/";
const build = "./wwwroot/build/";

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

promises.push(exec(`npm run fe-scss-build`));

for (let config of getAllConfigs("./Pages")) {
    promises.push(exec("npx rollup -c " + config + " --bundleConfigAsCjs"));
}

promises.push(removeMaps(root));
promises.push(removeMaps(build));

Promise.all(promises).then(() => console.log("build all done!"));
