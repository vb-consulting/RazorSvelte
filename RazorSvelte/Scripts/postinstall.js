const fs = require(`fs`);
const path = require(`path`);
const config = require(`./config`);

function cpy(from, to) {
    console.log(`Copying from ${from} to ${to} ...`);
    fs.copyFileSync(from, to);
}

const to = config.root;
const from = config.materialFontSrc;

//
// Copy the font files for material design icons
//
fs.readdirSync(from).forEach(file => {
    if (file.endsWith(".woff2") || file.endsWith(".woff")) {
        cpy(`${from}/${file}`, `${to}${file}`);
    }
});


const fontDir = config.fontDir;

//
// create the fonts directory if it doesn't exist
//
if(!fs.existsSync(fontDir)){
    console.log(`Creating dir ${fontDir} ...`)
    fs.mkdirSync(fontDir)
}

//
// Bootstrap Icons
//
cpy(config.bootstrapIconsWoff2, `${fontDir}${path.basename(config.bootstrapIconsWoff2)}`);
cpy(config.bootstrapIconsWoff, `${fontDir}${path.basename(config.bootstrapIconsWoff)}`);
