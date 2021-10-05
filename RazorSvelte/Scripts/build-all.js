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

const removeMaps = () => new Promise(resolve => {
    var root = "./wwwroot/build/";
    for (let file of fs.readdirSync(root)) {
        if (file.endsWith(".map")) {
            var name = root + "/" + file;
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

promises.push(exec(`npm run frontend-scss-build`));

for (let config of getAllConfigs("./Pages")) {
    promises.push(exec("rollup -c " + config));
}

promises.push(removeMaps());

Promise.all(promises).then(() => console.log("build all done!"));
