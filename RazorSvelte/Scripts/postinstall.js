const fs = require(`fs`);

let dir =`./wwwroot/fonts/`;
if (fs.existsSync(dir)) {
    console.log(`Removing files from ${dir} ...`);
    fs.readdirSync(dir).forEach(f => fs.rmSync(`${dir}/${f}`));
}

if (!fs.existsSync(dir) || !fs.existsSync(`${dir}bootstrap-icons.woff2`) || !fs.existsSync(`${dir}bootstrap-icons.woff`)) {
    if(!fs.existsSync(dir)){
        console.log(`Creating dir ${dir} ...`)
        fs.mkdirSync(dir)
    }
    if (!fs.existsSync(`${dir}bootstrap-icons.woff2`)) {
        console.log(`Copying ${dir}bootstrap-icons.woff2 from node_modules/bootstrap-icons ...`);
        fs.copyFileSync(`./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2`, `${dir}bootstrap-icons.woff2`);
    }
    if (!fs.existsSync(`${dir}bootstrap-icons.woff`)) {
        console.log(`Copying ${dir}bootstrap-icons.woff from node_modules/bootstrap-icons ...`);
        fs.copyFileSync(`./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff`, `${dir}bootstrap-icons.woff`);
    }
}
