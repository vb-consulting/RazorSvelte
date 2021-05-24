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

The end result is an **optimized web application** with the backend is rendered and served by .NET and the frontend is optimized by Svelte and Rollup and you can combine server-side rendering with optimized Svelte front-end rendering.

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

To be able to work with this file, you'll need an appropriate IDE plugin, like `svelte.svelte-vscode` for the Visual Studio Code. There are others for JetBrains Rider for example, but I'm not aware of any for standard Visual Studio.

### 2) `Index.cshtml.ts`

This the Svetle application entry point. You can define things like:

- Svelte target element. This is required.
- Global imports if any that Rollup will bundle on build. This is not required.
- Global props used in Svelte app. This is not required.

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

### 3) `rollup.config.js`


