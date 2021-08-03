# RazorSvelte

Project template repository containing a template project with the following setup:

- ASP.NET Razor Pages (C# and .NET5).
- Svelte JavaScript Framework configured for use with TypeScript and SCSS preprocessor.
- Rollup JavaScript bundler build system.
- Bootstrap 5 CSS framework configured for SCSS preprocessor.
- Sample authentication mechanism using JWT with cookies and with three external login providers (Google, Linkedin, and Github).
- Sample pages like index, privacy, login, logout, authorized sample page, unauthorized (401) and not found (404).

**Important Notes:**

- **There is no other NodeJS Web Server. Svelte is integrated with the Razor Pages.**
- Rollup JavaScript bundler is configured to output files into `wwwroot` and you can normally import them into Razor Pages (or any other pages).
- There is no need to configure CORS since everything is served by .NET Web Server (Kestrel).

## Why

- You can continue using the normal ASP.NET Razor Pages (or MVC).
- When you need JavaScript interactivity - you can just embed modern Framework such as Svelte.
- [Svelte](https://svelte.dev/) is compiled, the output is pure JS, doesn't have or need any runtime, and is very optimized, fast, and small.
- Svetle produces a small JavaScript file for your Razor Page that you can cache.
- Take advantage of the growing Svelte ecosystem and animation libraries.
- [Rollup](https://rollupjs.org/guide/en/#the-why) offers future-proof JS output and a tree-shaking feature that excludes any unused JavaScript.

The result is an ***very much optimized web application*** with:
- The Backend is rendered and served by .NET.
- The front end is rendered and optimized by Svelte and Rollup.

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

- `degit` just simply downloads and unzips the latest version of a git repo's contents without repository initialization (unlike `git clone` for example).

### From the GitHub:

Just click on the big green button **Use This Template**.

## Structure

#### Razor Pages Structure

Each Razor Page has two new nested files:

- `MyPage.cshtml.js` - rollup configuration file for this page.
- `MyPage.cshtml.ts` - entry typescript module file for this page.

Note:

Nesting of the files with the same name and different extension is supported by the Visual Studio and not by the Visual Studio Code at this point. If you need a different structure, feel free to reorganize them, but those two files are still required for each page.

#### Configuration file

Configuration file imports global config from `Scripts/rollup.config` and set the following values:

- Entry module typescript file.
- Compiler output JavaScript file. Default is `wwwroot/build` plus entry module name with the `js` extension).
- Compiler output CSS file for module scoped CSS/SCSS if any. Default is `wwwroot/build` plus entry module name with `css` extension.


[See sample pages in this repo](https://github.com/vb-consulting/RazorSvelte/tree/master/RazorSvelte/Pages).

#### Entry typescript module

Entry typescript module imports a Svelte file for this page and returns the Svelte app.

In this template, all examples use `document.body` as app target. That means that the default layout [`Pages/Shared/_Layout.cshtml`](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/Pages/Shared/_Layout.cshtml) only contains a body.

#### Razor Page

Body content is rendered by the Razor Page itself and the `svelte` component.

Each Svelte-enabled Razor Page has also to include an output JavaScript and CSS (if any), for example, for Index page:

```cshtml
@section HeadSection {
    <link href="~/build/index.css" asp-append-version="true" rel="stylesheet" />
    <script defer src="~/build/index.js" asp-append-version="true"></script>
}
```

#### Svelte components

All Svelte components and additional modules are in separate [`App` dir](https://github.com/vb-consulting/RazorSvelte/tree/master/RazorSvelte/App).

Each `svelte` file component in a root is used by the associated Razor Page as described above. Each of them will render the header, main section, and footer in this example.

That means that the majority of the markup is produced by the Svelte compiler in a single JavaScript file, for each page, with an average size of around 18KB. 

Rendering is instant and JS output is cached on the client to reduce download size.

## NPM Scripts and Tools

- Dotnet commands for use with NPM scripts UI extensions (run from your IDE):

    - `dotnet-run` for `dotnet run`.
    - `dotnet-clean`: for `dotnet clean`.
    - `dotnet-build`: for `dotnet build`.

- SCSS Styling Support:

    - `scss-build`: Build global css file `wwwroot/style.css` in compressed format from SCSS file `Styles/style.scss` that imports bootstrap SCSS (and adds a few custom colors).
    - `scss-watch`: Same as `scss-build` but only uncompressed and stays in a watch recursive mode to monitor for further changes.

- Build Support for the `Index` page:

    - `index-build`: Build JavaScript for the `Index` page. Output is `wwwroot/build/index.js` in a compressed format without any source maps. The JavaScript file can't be debugged. This is for production.
    - `index-watch`: Build JavaScript for the `Index` page. Output is `wwwroot/build/index.js` in an uncompressed format with the source maps. The JavaScript file can be debugged. This is not for production. The process will keep monitor for file changes and rebuild accordingly. This is useful for the development process.
    
Note: 

Add similar commands for the other pages as needed or run the associated `rollup` command from the command prompt.

- Build all pages:
    - `build-all-pages`: Calls `Scripts/build-all.js` script to build and compile all pages.

- Other:
    
    - `upgrade-npms`: Upgrades all NPM dependencies to the latest version. Use this with caution. To be able to run this command, the global `npm-check-updates` dependency is required. Use `npm install -g npm-check-updates` to install.

## FAQ

### Can I debug these pages?

Yes. 

You can use your browser debug console for debugging as you would normally. The JavaScript needs to have an associated `.map` file.

To create a `.map` file run `rollup` and configuration file as argument command with `-w` switch. For example:

`rollup -c ./Pages/Index.cshtml.js -w`

This command creates an uncompressed `wwwroot/build/index.js` file with an associated map that enables debugging in your browser.

In your browser sources tab, you will see your `App/index.svetle` typescript file that you can debug normally.

Also, this command will continue watching your source file(s) and will incrementally build as you continue to change it. 

### Building all pages is slow. Can I make it faster?

Yes. 

Don't use the "build all" command. Instead, use incremental build as described above in the previous question.

### Do I need NodeJS Development Server?

No, you don't need any external server. 

This project uses a built-in .NET web server.

However, you will need to have NodeJS and NPM installed to run Rollup commands.

### How can I use external logins from Google, LinkedIn, or GitHub from this example?

You will have to create a login app on these services to retrieve Client ID and Client Secret values and paste them to the configuration files.

- [https://console.cloud.google.com/apis/](https://console.cloud.google.com/apis/) for Google
- [https://www.linkedin.com/developers/apps/](https://www.linkedin.com/developers/apps/) for LinkedIn
- [https://github.com/settings/developers/](https://github.com/settings/developers/) for GitHub

See [appsettings.json](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/appsettings.json) for more details.

### Is page routing done on the client or the server?

Page routing is still handled on the server by the ASP.NET Web Server. That means that this project is not a Single-Page Application (SPA).

However, if you want - you can use any client router inside your page(s).

For example, a [svelte navigator](https://svelte.dev/repl/451fd183e0d3403cb7800101f7d799fb?version=3.41.0) or any other Svelte client router from the Svelte ecosystem.

It doesn't have to be Svelte, you can use any other JavaScript/TypeScript client router from the NPM, for example [universal router](https://www.npmjs.com/package/universal-router).

### Can I send data from my Razor Page to the Svelte omponent?

Yes, for example, by using hidden inputs.

See [`Pages/Privacy.cshtml`](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/Pages/Privacy.cshtml#L11)

1. Place `<input id="title" type="hidden" value="@ViewData["Title"]" />` in your page.
2. In your Svelte file:

```typescript
import { get } from "./shared/hidden-values";
let title = get<string>("title");
```

### Is this faster than the regular Razor Pages with JavaScript?

Besides being much easier and faster to develop and maintain, yes it is faster.

Entire markup is contained and minified inside compiled JavaScript files from Svelte components which are then downloaded the first time and then cached for every new request.

This significantly reduces network traffic for your application.

Markup is then rendered instantly when the page loads.

## Licence
 
Copyright (c) Vedran Bilopavlović - VB Consulting and VB Software 2021
This source code is licensed under the [MIT license](https://github.com/vb-consulting/RazorSvelte/blob/master/LICENSE).
