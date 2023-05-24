module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    plugins: ["svelte3", "@typescript-eslint"],
    ignorePatterns: ["*.cjs"],
    overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
    settings: {
        "svelte3/typescript": () => require("typescript")
    },
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020
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
