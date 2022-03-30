import config from "../Scripts/rollup.config";
export default config({ input: "./Pages/AuthorizedPage.entry.ts", jsOutput: "./wwwroot/build/authorized-page.js", cssOutput: "authorized-page.css" });