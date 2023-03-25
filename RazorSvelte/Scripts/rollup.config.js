import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import replace from '@rollup/plugin-replace';
import path from "path";
import alias from "@rollup/plugin-alias";

const config = require(path.join(process.cwd(), "Scripts", "config.js"));
const production = !process.env.ROLLUP_WATCH;

const getName = str => {
    var split = str.split("/");
    return (split[split.length - 1].split(".")[0]).toLowerCase();
}

export default (param, globals) => {
    var input;
    var jsOutput;
    var cssOutput;
    var appObject;
    if (typeof param === "string") {
        input = param;
        appObject = getName(input);
        jsOutput = config.build + appObject + ".js";
        cssOutput = appObject + ".css";
    } else {
        input = param.input;
        var name = getName(input);
        appObject = param.appObject ? param.appObject : name;
        jsOutput = param.jsOutput ? param.jsOutput : config.build + name + ".js";
        cssOutput = param.cssOutput ? param.cssOutput : name + ".css";
    }
    globals = globals || {};
    return {
        input: input,
        output: {
            sourcemap: !production,
            format: "iife",
            name: appObject,
            file: jsOutput,
            globals: globals || {}
        },
        plugins: [
            alias({
                entries: [
                    { find: "$lib", replacement:  path.resolve(__dirname, config.libRelativePath) },
                    
                    { find: "$area", replacement:  path.resolve(__dirname, config.libRelativePath) + "/area" },
                    { find: "$charting", replacement:  path.resolve(__dirname, config.libRelativePath) + "/charting" },
                    { find: "$data", replacement:  path.resolve(__dirname, config.libRelativePath) + "/data" },
                    { find: "$element", replacement:  path.resolve(__dirname, config.libRelativePath) + "/element" },
                    { find: "$forms", replacement:  path.resolve(__dirname, config.libRelativePath) + "/forms" },
                    { find: "$layouts", replacement:  path.resolve(__dirname, config.libRelativePath) + "/layouts" },
                    { find: "$overlay", replacement:  path.resolve(__dirname, config.libRelativePath) + "/overlay" },
                    { find: "$visual", replacement:  path.resolve(__dirname, config.libRelativePath) + "/visual" },

                    { find: "$shared", replacement:  path.resolve(__dirname, config.sharedRelativePath) },
                    { find: "$layout", replacement:  path.resolve(__dirname, config.libRelativePath) + "/layouts" },
                ]
            }),
            replace({
                preventAssignment: true,
                "process.env.NODE_ENV": JSON.stringify("development")
            }),
            svelte({
                preprocess: sveltePreprocess({ sourceMap: !production }),
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production,
                    customElement: false
                }
            }),
            // we"ll extract any component CSS out into
            // a separate file - better for performance
            css({ output: cssOutput }),

            // If you have external dependencies installed from
            // npm, you"ll most likely need these plugins. In
            // some cases you"ll need additional configuration -
            // consult the documentation for details:
            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            resolve({
                browser: true,
                dedupe: ["svelte"]
            }),
            commonjs({ 
                sourceMap: !production 
            }),
            typescript({
                sourceMap: !production,
                inlineSources: !production,
                types: ["svelte"],
                resolveJsonModule: true
            }),

            // If we"re building for production (npm run build
            // instead of npm run dev), minify
            production && terser()
        ],
        watch: {
            clearScreen: false
        }
    }
};
