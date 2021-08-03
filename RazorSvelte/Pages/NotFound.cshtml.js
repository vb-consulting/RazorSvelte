import config from "../Scripts/rollup.config";
export default config({ input: "./Pages/NotFound.cshtml.ts", jsOutput: "./wwwroot/build/404.js"}, {"bootstrap": "bootstrap"});
