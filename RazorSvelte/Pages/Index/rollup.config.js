import config from "../../rollup.config";

//
// To set input module, output javascript file, css output file and application object name us this.
// Only input is required, other values are extrapolated from the input value using pattern in this example.
//
/*
export default config({
    input: "./Pages/Index/Index.cshtml.ts", // required
    jsOutput: "./wwwroot/build/index.js", // not required, if not set "./wwwroot/build/{input file name}.js"
    cssOutput: "index.css", // not required, if not set "{input file name}.css"
    appObject: "index" // not required, if not set "{input file name}"
}, {
    // second parameter defines a bootstrap global object
    // actual import is in Index.cshtml.ts: import bootstrap from "../../node_modules/bootstrap/js/src/collapse.js"
    "bootstrap": "bootstrap" 
});
*/


//
// To set only input module, use this.
// Other values are extrapolated from the input value using pattern in previous example.
//
export default config("./Pages/Index/Index.cshtml.ts", {"bootstrap": "bootstrap"});

