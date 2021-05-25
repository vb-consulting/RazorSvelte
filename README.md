# RazorSvelte

This is a template repository that contains a template project with the following setup:

- ASP.NET Razor Pages (C# and .NET5).
- Svelte JavaScript Framework configured with the TypeScript and SCSS preprocessor plugins.
- Rollup JavaScript bundler
- Bootstrap 5 CSS framework configured for SCSS preprocessor.

Notes:
> There is no other NodeJS Web Server. Rollup JavaScript bundler is configured to output files into `wwwroot` and you can normally import them into Razor Pages (or any other pages), so there is no need to configure CORS since everything is served by .NET Web Server.

## Why

- You can continue using the normal ASP.NET Razor Pages (or MVC)
- When you need JavaScript interactivity, you can embed modern Framework such as Svelte
- [Svelte](https://svelte.dev/) is compiled, the output is pure vanilla JS, doesn't have or need any runtime, and is extremely fast and small.
- [Rollup](https://rollupjs.org/guide/en/#the-why) offers future-proof JS output and a tree-shaking feature that excludes any unused JavaScript.

The end result is an ***very much optimized web application*** with:
- backend is rendered and served by .NET and 
- the frontend is optimized by Svelte and Rollup 

And, you can combine server-side rendering with optimized Svelte front-end rendering.

Best of all - you can avoid tedious configuration by using this template.

## Installation

### From the command-line:

```
$ npx degit vb-consulting/RazorSvelte
> cloned vb-consulting/RazorSvelte#HEAD
$ cd RazorSvelte
$ npm install
...
$ dotnet run
```

Note: 
> `degit` just simply downloads and unzips the latest version of a git repo's contents without repository initialization (unlike `git clone` for example).

### From the GitHub:

Just click on the big green button **Use This Template**.

## NPM Scripts

- `dotnet-run`: For `dotnet run`.
- `dotnet-clean`: For `dotnet clean`.
- `dotnet-build`: For `dotnet build`.
- `scss-build`: Build global css file `wwwroot/style.css` in compressed format from SCSS file `Styles/style.scss` that imports bootstrap SCSS (and adds a few custom colors).
- `scss-watch`: Same as `scss-build` and stay in watch recursive mode to monitor for changes.
- `index-build`: Build JavaScript for the `Index` page. Output is `wwwroot/build/index.js` in a compressed format without any source maps. The JavaScript file can't be debugged. This is for production.
- `index-watch`: Build JavaScript for the `Index` page. Output is `wwwroot/build/index.js` in an uncompressed format with source maps. The JavaScript file can be debugged. This is not for production. The process will keep monitor for file changes and rebuild accordingly.

## Index page example

There is only one Razor page configured to work with Svetle in this project template - The index page.

To enable the razor page to use Svelte three new files need to be added (don't worry, two of them are small, basically configs). 
And since there are three new files, I've placed the Index page in its dir, but this is not mandatory.

The are also named as `Index.cshtml` with different extenstions (except for the config file) to enable Visual Studio nesting:

<img src="https://raw.githubusercontent.com/vb-consulting/RazorSvelte/master/index-page.png" alt="index page" />

For the Index page those are: 

### 1) `Index.cshtml.svelte`

Main Svelte file, this is where your Svelte app is at.

To be able to work with this file, you'll need an appropriate IDE plugin, like [`svelte.svelte-vscode`](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) for the Visual Studio Code (recommendation included in this template). 

There are others for JetBrains Rider for example, but I'm not aware of any for standard Visual Studio.

Note:
> There is Visual Studio extension for Svetle after all: [Svelte For Visual Studio](https://marketplace.visualstudio.com/items?itemName=lyu-jason.svelte-vs). Now you can use normal Visual Studio. And if you're using Visual Studio, I also recommend [NpmTaskRunner](https://github.com/madskristensen/NpmTaskRunner) to easily run NPM commands and scripts from the Visual Studio.

### 2) `Index.cshtml.ts`

This the Svelte application entry point. You can define things like:

- Svelte target element. This is required.
- Global imports if any that Rollup will bundle on the build. This is not required.
- Global props used in the Svelte app. This is not required.

Example for the Index page

```javascript
import App from "./Index.cshtml.svelte";
import bootstrap from "bootstrap/js/src/collapse"

const index = new App({
    target: document.getElementsByClassName("index")[0],
    props: {
        name: "world"
    }
});

export default index;
```

- Svelte target element is the first element with the class `index`.
- Global import that is bundled together with the rest of the JavaScript is `bootstrap/js/src/collapse`. This module is needed for bootstrap menu collapse functionality.
- Global props are `{name: "world"}`. This just for the demo.

Note 1:
> Import `import bootstrap from "bootstrap/js/src/collapse"` is actually import directly from `node_modules`. Rollup understand that `import from "something"` is actually short for `import from "../../node_module/something"`.

Note 2:
> This is an entry point for the application. The application is defined as JavaScript as produced by the Rollup bundler. So, you can import other modules written in either TypeScript - or - JavaScript that uses CommonJs module specification or no module at all (plain script, like the bootstrap script for example). Also, you don't have to use Svelte at this point, you can continue to write normal, vanilla Typescript for your page or import some other framework library or script, Rollup will take care of bundling and tree shaking.

### 3) `rollup.config.js`

Defines a Rollup configuration. Main Rollup configuration is in a root `rollup.config.js` which only exposes a function that we can later use. 

For example:

```javascript
import config from "../../rollup.config";

export default config("./Pages/Index/Index.cshtml.ts", {"bootstrap": "bootstrap"});
```

This is a default configuration in this example. It configures the following:

- `"input": "./Pages/Index/Index.cshtml.ts"` - input file for compilation is our target file.
- `"jsOutput": "./wwwroot/build/index.js"` - output this JavaScript file.
- `"cssOutput": "index.css"` - css output file from the scoped module css (defined in `Index.cshtml.svelte`). Same dir as `jsOutput`.
- `"appObject": "Index"` - the name of the global application file produced by the compiler.
- `{"bootstrap": "bootstrap"}` - map global `bootstrap` object to `bootstrap` global name.

If you don't need any global objects like `bootstrap` or `jquery`, you can leave out the last parameter and just use:

```javascript
export default config("./Pages/Index/Index.cshtml.ts");
```

If you whish to specify each configuration option just use object in the first parameter:

```javascript
export default config({
    input: "./Pages/Index/Index.cshtml.ts", // required
    jsOutput: "./wwwroot/build/index.js", // not required, default is "./wwwroot/build/{input file name}.js"
    cssOutput: "index.css", // not required, default is "{input file name}.css"
    appObject: "index" // not required, default is "{input file name}"
}, {
    "bootstrap": "bootstrap" 
});
```

Note:
> Since we defined our JavaScript and CSS outputs in this configuration, now we can import them in our Razor `Index.cshtml` page (or any other Razor page or component) like this:

```cshtml
@section HeadSection {
    <link href="~/build/index.css" asp-append-version="true" rel="stylesheet" />
    <script defer src="~/build/index.js" asp-append-version="true"></script>
}
```

## Screenshot

<img src="https://raw.githubusercontent.com/vb-consulting/RazorSvelte/master/example.png" alt="index page" />

## Licence
 
Copyright (c) Vedran Bilopavlović - VB Consulting and VB Software 2021
This source code is licensed under the [MIT license](https://github.com/vb-consulting/RazorSvelte/blob/master/LICENSE).
