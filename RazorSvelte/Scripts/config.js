module.exports = { 
    root: `./wwwroot/`,
    build: "./wwwroot/build/",
    pagesDir: "./Pages",
    
    scriptsDirName: "Scripts",
    
    pagePath: "/Pages/",
    appPath: "/App/",
    
    libRelativePath: "../App/lib",
    sharedRelativePath: "../App/shared",

    layoutFilePath: "/App/shared/link-list-items.svelte",

    materialFontSrc: `./node_modules/@material-design-icons/font`,
    fontDir: `./wwwroot/fonts/`,
    bootstrapIconsWoff2: `./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2`,
    bootstrapIconsWoff: `./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff`,

    rollupExt: ".rollup.config.js",
    cshtmlExt: ".cshtml",
    csExt: ".cshtml.cs",
    entryExt: ".entry.ts",
    svelteExt: ".svelte",
    csprojExt: `.csproj`,

    defaultNamespace: "RazorSvelte",
    rollupExtraArgs: " --bundleConfigAsCjs",

    parallelBuild: true,
    
    recreateIconTypes: true,
    iconTypesFileName: "App/lib/icons.d.ts",
    bootstrapIconTypes: "./node_modules/bootstrap-icons/font/bootstrap-icons.json",
    materialIconTypes: "./node_modules/@material-design-icons/font/index.d.ts",
}
