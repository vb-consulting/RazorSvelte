import config from "../Scripts/rollup.config";
export default config({ input: "./Pages/SpaExample.entry.ts", jsOutput: "./wwwroot/build/spa-example.js", cssOutput: "spa-example.css" });