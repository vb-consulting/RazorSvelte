import config from "../Scripts/rollup.config";

// Define global variables bootstrap mapped to bootstrap module and q mapped to jquery module
// This allows us to do:
// import q from "jquery"; 
// import q from "bootstrap"; 

// Note: $ is reserved in svelte so we use q instead but it can be anything: jQuery or jq

export default config("./Pages/Index.cshtml.ts", {"bootstrap": "bootstrap", "jquery": "q"})

