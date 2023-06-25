module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:svelte/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    plugins: ["@typescript-eslint"],
    ignorePatterns: ["*.cjs"],
    overrides: [
        {
            files: ["*.svelte"],
            parser: "svelte-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser"
            }
        }
    ],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"]
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    rules: {
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-undef": "off",
        "no-wrap-func": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                extendDefaults: true,
                types: {
                    "{}": false
                }
            }
        ]
    }
};
