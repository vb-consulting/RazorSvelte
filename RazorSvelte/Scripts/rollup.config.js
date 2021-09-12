import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import monaco from 'rollup-plugin-monaco-editor';

const production = !process.env.ROLLUP_WATCH;

export default input => {
    return {
        input: input,
        output: {
            sourcemap: !production,
            format: "es",
            dir: "wwwroot",
            globals: {}
        },
        plugins: [

            postcss(),
            monaco({
                languages: ["pgsql"],
            }),

            replace({
                preventAssignment: true,
                "process.env.NODE_ENV": JSON.stringify("development"),
                "wwwroot": ""
            }),
            svelte({
                preprocess: sveltePreprocess({ sourceMap: !production }),
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production
                }
            }),
            resolve({
                mainFields: [
                    'exports',
                    'browser:module',
                    'browser',
                    'module',
                    'main',
                ].filter(Boolean),
                extensions: ['.mjs', '.cjs', '.js', '.json'], 
                preferBuiltins: true, // Default: true
                browser: true,
                dedupe: ["svelte"]
            }),
            commonjs(),
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
