const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const config = require(`./config`);

const build = config.build;
const pagesDir = config.pagesDir;
const rollupExt = config.rollupExt;

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

const _removeFiles = (root, test) => {
    for (let file of fs.readdirSync(root)) {
        if (test(file)) {
            var name = (root + "/" + file).replace("//", "/");
            console.log("removing file ", name);
            try {
                fs.unlinkSync(name)
                //file removed
            } catch (err) {
                console.error(err)
            }
        }
    }
};

if (!fs.existsSync(build)) {
    console.log("Creating dir " + build + " ...");
    fs.mkdirSync(build);
} else {
    _removeFiles(build, () => true);
}

if (!config.parallelBuild) {
    async function run() {
        for (let config of getAllConfigs(pagesDir)) {
            await exec("npx rollup -c " + config + rollupExtraArgs);
        }
    }
    run().then(() => console.log("Build all done!"));
} else {
    const promises = [];
        
    promises.push(exec(`npm run fe-scss-build`));
    
    for (let config of getAllConfigs(pagesDir)) {
        promises.push(exec("npx rollup -c " + config + rollupExtraArgs));
    }
    
    Promise.all(promises).then(() => console.log("Build all done!"));
}
