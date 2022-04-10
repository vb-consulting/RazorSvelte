const fs = require("fs");

if (!fs.existsSync("./wwwroot/fonts/") || !fs.existsSync("./wwwroot/fonts/bootstrap-icons.woff2") || fs.existsSync("./wwwroot/fonts/bootstrap-icons.woff")) {
    if(!fs.existsSync("./wwwroot/fonts/")){
        console.log("Creating dir./wwwroot/fonts/ ...")
        fs.mkdirSync("./wwwroot/fonts/")
    }
    if (!fs.existsSync("./wwwroot/fonts/bootstrap-icons.woff2")) {
        console.log("Copying ./wwwroot/fonts/bootstrap-icons.woff2 from node_modules/bootstrap-icons ...");
        fs.copyFileSync("./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", "./wwwroot/fonts/bootstrap-icons.woff2");
    }
    if (!fs.existsSync("./wwwroot/fonts/bootstrap-icons.woff")) {
        console.log("Copying ./wwwroot/fonts/bootstrap-icons.woff from node_modules/bootstrap-icons ...");
        fs.copyFileSync("./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff", "./wwwroot/fonts/bootstrap-icons.woff");
    }
}