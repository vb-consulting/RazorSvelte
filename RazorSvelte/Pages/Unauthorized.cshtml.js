import config from "../Scripts/rollup.config";
export default config({ input: "./Pages/Unauthorized.cshtml.ts", jsOutput: "./wwwroot/build/401.js"}, {"bootstrap": "bootstrap"});
