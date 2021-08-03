const fs = require("fs");
const path = require("path");
const cp = require('child_process');

const getAllConfigs = function (dir, result) {
    let files = fs.readdirSync(dir)
    result = result || [];
    
    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            result = getAllConfigs(path.join(dir, file), result)
        } else {
            if (file.endsWith(".cshtml.js")) {
                result.push("./" + path.join(dir, file).replace(/[\\/]/g, "/"));
            }
        }
    })

    return result;
}

for (let config of getAllConfigs("./Pages")) {
    let cmd = "rollup -c " + config;
    let exec = cp.exec(cmd);
    exec.stdout.on('data', data => { if (data) { console.log(data); } });
    exec.stderr.on('data', data => { if (data) { console.error(data); } });
}
