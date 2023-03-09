const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const config = require(`./config`);

const root = config.root;
const build = config.build;
const pagesDir = config.pagesDir;
const rollupExt = config.rollupExt;
const mapExt = config.mapExt;
const rollupExtraArgs = config.rollupExtraArgs;

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
            if (file.endsWith(rollupExt)) {
                result.push("./" + path.join(dir, file).replace(/[\\/]/g, "/"));
            }
        }
    })

    return result;
}

const removeMaps = root => {
    for (let file of fs.readdirSync(root)) {
        if (file.endsWith(mapExt)) {
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
};

if (!config.parallelBuild) {
    async function run() {
        for (let config of getAllConfigs(pagesDir)) {
            await exec("npx rollup -c " + config + rollupExtraArgs);
        }
    }

    if (!fs.existsSync(build)) {
        console.log("Creating dir " + build + " ...");
        fs.mkdirSync(build);
    } else {
        removeMaps(build);
    }
    removeMaps(root);

    run().then(() => console.log("Build all done!"));
} else {
    const removeMaps = root => new Promise(resolve => {
        for (let file of fs.readdirSync(root)) {
            if (file.endsWith(mapExt)) {
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
    
    if (!fs.existsSync(build)) {
        console.log("Creating dir " + build + " ...");
        fs.mkdirSync(build);
    } else {
        removeMaps(build);
    }
    
    promises.push(exec(`npm run fe-scss-build`));
    
    for (let config of getAllConfigs(pagesDir)) {
        promises.push(exec("npx rollup -c " + config + rollupExtraArgs));
    }
    
    promises.push(removeMaps(root));
    
    Promise.all(promises).then(() => console.log("Build all done!"));
}
