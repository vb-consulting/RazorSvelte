import config from "../Scripts/rollup.config";
export default config({ input: "./Pages/NotFound.entry.ts", jsOutput: "./wwwroot/build/404.js", cssOutput: "404.css"});
