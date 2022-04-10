import config from "../Scripts/rollup.config";
export default config({ input: "./Pages/Unauthorized.entry.ts", jsOutput: "./wwwroot/build/401.js", cssOutput: "401.css"});
