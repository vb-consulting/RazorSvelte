module.exports = { 
    root: `./wwwroot/`,
    build: "./wwwroot/build/",
    pagesDir: "./Pages",
    
    scriptsDirName: "Scripts",
    
    pagePath: "/Pages/",
    appPath: "/App/",
    layoutFilePath: "/App/shared/link-list-items.svelte",

    materialFontSrc: `./node_modules/@material-design-icons/font`,
    fontDir: `./wwwroot/fonts/`,
    bootstrapIconsWoff2: `./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2`,
    bootstrapIconsWoff: `./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff`,

    rollupExt: ".rollup.config.js",
    mapExt: ".map",
    cshtmlExt: ".cshtml",
    csExt: ".cshtml.cs",
    entryExt: ".entry.ts",
    svelteExt: ".svelte",
    csprojExt: `.csproj`,

    defaultNamespace: "RazorSvelte",
    rollupExtraArgs: " --bundleConfigAsCjs"
}
