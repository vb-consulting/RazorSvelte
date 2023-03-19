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
    console.log(`Creating dir ${fontDir} ...`);
    fs.mkdirSync(fontDir)
}

//
// Bootstrap Icons
//
cpy(config.bootstrapIconsWoff2, `${fontDir}${path.basename(config.bootstrapIconsWoff2)}`);
cpy(config.bootstrapIconsWoff, `${fontDir}${path.basename(config.bootstrapIconsWoff)}`);

const recreateIconTypes = config.recreateIconTypes;
const iconTypesFileName = config.iconTypesFileName;

if (recreateIconTypes && iconTypesFileName) {
    console.log(`Creating file ${iconTypesFileName} ...`);
    const content = [];
    content.push("// auto generated");
    
    //bootstrap icons:
    if (config.bootstrapIconTypes) {
        //console.log(JSON.parse(fs.readFileSync(config.bootstrapIconTypes, 'utf8')));
        content.push("");
        content.push("type BootstrapIconsType =");
        for(var item of Object.keys(JSON.parse(fs.readFileSync(config.bootstrapIconTypes, 'utf8')))) {
            content.push(`    | "${item}"`);
        }
        content[content.length - 1] = content[content.length - 1] + ";";
    }
    
    //material icons:
    if (config.materialIconTypes) {
        content.push("");
        content.push("type MaterialIconsType =");
        for(var item of fs.readFileSync(config.materialIconTypes, 'utf8').split("\n")) {
            if (item.endsWith("\",") || item.endsWith("\"")) {
                var first = item.indexOf("\"");
                var last = item.lastIndexOf("\"");
                content.push(`    | "${item.substring(first + 1, last)}"`);
            }
        }
        content[content.length - 1] = content[content.length - 1] + ";";
    }
    
    //create iconTypesFileName file from content lines
    fs.writeFileSync(iconTypesFileName, content.join("\n"));
    
}
