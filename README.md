# RazorSvelte

> **Note:** 
> 
> There are several other UI Component frameworks evaluated, and finally this template is settled with Bootstrap.
> 
> To use other templates, for example, Carbon or Material UI, see installation instructions below in this file.
>
> This is a project template and as such is being constantly updated with improvements and new components needed more modern and versatile web application. 

Project template repository containing a template project with the following setup:

- ASP.NET Razor Pages (C# and .NET6).
- Svelte JavaScript Framework configured for use with TypeScript and SCSS preprocessor.
- Rollup JavaScript bundler build system.
- Bootstrap 5+ CSS framework configured for SCSS preprocessor, see [https://getbootstrap.com/docs/](https://getbootstrap.com/docs/).
- For Bootstrap icons, see [https://icons.getbootstrap.com/](https://icons.getbootstrap.com/).
- Sample authentication mechanism using (JWT using cookies with optional refresh tokens)  and with three external login providers (Google, Linkedin, and Github).
- Sample pages like index, privacy, login, logout, authorized sample page, unauthorized (401), not found (404), and error page.
- Sample Single Page Application example using hashtag router component.
- Built-in dark theme support with a theme built-in switching mechanism.
- Sample Bootstrap components with the demo. New components are being added constantly.
- UI components include: 
  - `chart` - wrapper for Chart.js.
  - `chart-box` - chart with title and full-screen zoom buttons.
  - `data-grid` - data grid with the remote data source that uses bootstrap tables.
  - `modal` - wrapper for the bootstrap modal.
  - `multiselect` - multiple dropdown select with search and virtual scroll.
  - `offcanvas` - wrapper for the bootstrap offcanvas.
  - `pager` - bootstrap pager that works with data-grid.
  - `placeholder` - loading placeholder based on the bootstrap placeholder, mostly used by other components to manage an un-initialized state.
  - `search-input` - simple search input with a search icon that handles search timeouts and prevents multiple search requests.
  - etc, many more are being added regularly

To see usage examples for these components see [this project](https://github.com/vb-consulting/postgresql-driven-development-demo/tree/master/PDD.WebApp).

![Screenshot](https://github.com/vb-consulting/RazorSvelte/blob/master/screenshot1.2.0.png)

## Demo docker

Follow these steps to build and run the RazorSvelte demo application:

1. Download the Dockerfile from [https://raw.githubusercontent.com/vb-consulting/RazorSvelte/master/Dockerfile](https://raw.githubusercontent.com/vb-consulting/RazorSvelte/master/Dockerfile) (or just run `wget `https://raw.githubusercontent.com/vb-consulting/RazorSvelte/master/Dockerfile` from the command prompt)

2. Open a command prompt and navigate to the folder where you saved the Dockerfile

3. Run the following commands:

`docker build -t razorsvelte .`
`docker run --rm -it -p 5000:80 --name razorsvelte razorsvelte:latest`

Note: 
> If you try to login with an external provider you will be redirected to error page. Please edit `appsettings.json` with your own client provider id and client secrets and make sure that OAuth application redirects to `localhost:5000`` - to enable this feature.

## Sample pages

- `/`: index page - show value from external props hello `world from svelte` and display useful links
- `/privacy` - privacy sample page, shows h1 title in a Svelte page passed from Razor Page ViewData.
- `/login` - show external login buttons
- `/authorized` - Sample authorized page protected with the `Authorize` attribute. Displays simple authorized user data passed from the Razor Page.
- `/401` - Sample unauthorized page that redirects when an unauthorized user tries to access the page with the `Authorize` attribute.
- `/404` - Not found page for unknown server routes.
- `/spa` Example of the Single Page Application (SPA) with the hashtag client router component that displays various routes in a SPA fashion.

**Important Notes:**

- **There is no other NodeJS Web Server. Svelte is integrated with the Razor Pages.**
- Rollup JavaScript bundler is configured to output files into `wwwroot` and you can normally import them into Razor Pages (or any other pages).
- There is no need to configure CORS since everything is served by .NET Web Server (Kestrel).

## Why

- [Svelte](https://svelte.dev/) is a radical new approach to building user interfaces. 

- Whereas traditional frameworks like React and Vue do the bulk of their work in the browser - Svelte shifts that work into a compile step that happens when you build your app. Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes.

- [Svelte](https://svelte.dev/) is a compiler that produces small and very optimized JavaScript output.

- [Svelte](https://svelte.dev/) bundles your markup into compiler output as well, which is even smaller than what the normal markup would be.

- [Svelte](https://svelte.dev/) compiler output is then cached in the browser which makes every subsequent request even faster since the browser doesn't even have to download that markup again.

- Since [Svelte](https://svelte.dev/) produces pure vanilla JavaScript, there is no runtime overhead. This also means that you can import and bundle (with rollup) and runtime framework that you might need, perhaps to reuse the old UI components you might have. For example, legacy code with jQuery.

- [Svelte](https://svelte.dev/) has become the most loved web framework for developers in a 2021 year, according to the [StackOverflow survey](https://insights.stackoverflow.com/survey/2021#most-loved-dreaded-and-wanted-webframe-love-dread).

- [Rollup](https://rollupjs.org/guide/en/#the-why) is already pre-configured to run with the ASP.NET project, compile, bundle and remove unused modules, and then output into your `wwwroot` of your ASP.NET project.

- You can also continue using the normal ASP.NET Razor Pages (or MVC) as you normally would.

The result is a **very**** optimized web**** application*** with:
- The Backend is served by ASP.NET.
- The front end is rendered and optimized by Svelte and Rollup.

And, you can combine server-side rendering with optimized Svelte front-end rendering.

Best of all - you can avoid tedious configuration by using this template.

## Installation

### From the command line:

#### Main template

```
$ npx degit vb-consulting/RazorSvelte
> cloned vb-consulting/RazorSvelte#HEAD
$ cd RazorSvelte
$ npm install
...
$ dotnet run
```

#### Carbon UI template

```
$ npx degit vb-consulting/RazorSvelte#carbon
> cloned vb-consulting/RazorSvelte#carbon
$ cd RazorSvelte
$ npm install
...
$ dotnet run
```


#### Material UI template

```
$ npx degit vb-consulting/RazorSvelte#svelte-material-ui
> cloned vb-consulting/RazorSvelte#svelte-material-ui
$ cd RazorSvelte
$ npm install
...
$ dotnet run
```

#### .NET 5 template

```
$ npx degit vb-consulting/RazorSvelte#net5
> cloned vb-consulting/RazorSvelte#net5
$ cd RazorSvelte
$ npm install
...
$ dotnet run
```

#### jQuery template

jQuery example only has one page that demonstrates how to bundle use jQuery with Svelte and Rollup.

```
$ npx degit vb-consulting/RazorSvelte#jquery
> cloned vb-consulting/RazorSvelte#jquery
$ cd RazorSvelte
$ npm install
...
$ dotnet run
```

Note: 

- `degit` just simply downloads and unzips the latest version of a git repo's contents without repository initialization (unlike `git clone` for example).

### From the GitHub:

Just click on the big green button **Use This Template**.

If you want some other template rather than the main template (like jQuery or NET5 example) - change the branch first.

## Structure

### Razor Pages Structure

Each Razor Page has two new nested files:

- `MyPage.rollup.config.js` - rollup configuration file for this page.
- `MyPage.entry.ts` - entry point typescript module file for this page.

Note:

- Those two new files are dependent on the `MyPage.cshtml` (via project file settings) so that IDEs like VisualStudio and JetBrains Rider would nest them visually. 
- You can nest files in Visual Studio Code by enabling file nesting and updating "File Nesting: Patterns" under the Explorer settings. Add an item with an item name of `*.cshtml` and a value of `${basename}.cshtml.cs, ${basename}.entry.ts, ${basename}.rollup.config.js`.

### Configuration file

Configuration file imports global config from `Scripts/rollup.`config` and sets the following values:

- Entry module typescript file.
- Compiler output JavaScript file. The default is `wwwroot`/build` plus entry module name with the `js` extension).
- Compiler output CSS file for module scoped CSS/SCSS if any. The default is `wwwroot`/build` plus entry module name with `css` extension.


[See sample pages in this repo](https://github.com/vb-consulting/RazorSvelte/tree/master/RazorSvelte/Pages).

### Entry typescript module

The Entry typescript module imports a Svelte file for this page and returns the Svelte app.

In this template, all examples use `document.body` as app target. That means that the default layout [`Pages/Shared/_Layout.cshtml`](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/Pages/Shared/_Layout.cshtml) only contains a body.

### Razor Page

Body content is rendered by the Razor Page itself and the `svelte` component.

Each Svelte-enabled Razor Page has also to include an output JavaScript and CSS (if any), for example, for Index page:

```cshtml
@section HeadSection {
    <link href="~/build/index.css" asp-append-version="true" rel="stylesheet" />
    <script defer src="~/build/index.js" asp-append-version="true"></script>
}
```

### Svelte components

All Svelte components and additional modules are in separate [`App` dir](https://github.com/vb-consulting/RazorSvelte/tree/master/RazorSvelte/App).

Each `svelte` file component in a root is used by the associated Razor Page as described above. Each of them will render the header, main section, and footer in this example.

That means that the majority of the markup is produced by the Svelte compiler in a single JavaScript file, for each page, with an average size of around 18KB. 

Rendering is instant and JS output is cached on the client to reduce download size.

## NPM Scripts and Tools

- Dotnet commands for use with NPM scripts UI extensions (run from your IDE):

    - `dotnet-run` for `dotnet run`.
    - `dotnet-clean`: for `dotnet clean`.
    - `dotnet-build`: for `dotnet build`.

- SCSS Styling Support

    - `fe-scss-build`: Build global CSS files `wwwroot/style.css` in compressed format from SCSS files `App/scss/style.scss` that imports.
    - `fe-scss-watch`: Build global CSS files `wwwroot/style.css` in uncompressed format from SCSS files `App/scss/style.scss` that imports and stays in a watch recursive mode.

- Build Support for the `Index` page

    - `fe-build`: Build JavaScript for the `Index` page. The output is `wwwroot/build/index.js` in a compressed format without any source maps. The JavaScript file can't be debugged. This is for production
    - `fe-watch`: Build JavaScript for the `Index` page. The output is `wwwroot/build/index.js` in an uncompressed format with the source maps. The JavaScript file can be debugged. This is not for production. The process will keep monitoring for file changes and rebuild accordingly. This is useful for the development process.
    
Note: 
To build or watch other pages you can use this command line `npm run fe-build <page>` or `npm run fe-build <page>`, where the page name is a lowercase config file without extensions. For example `index` for `./Pages/Index.rollup.config.js`, `login` for `./Pages/Login.rollup.config.js`, etc.


- All pages
    - `fe-build-all`: Frontend build-all. Calls `Scripts/build-all.js` script to build and compile all pages and all stylesheets.
    - `fe-watch-all: Frontend watch-all. Calls `Scripts/watch-all.js` script to build, compile and watch all pages and all stylesheets.

- Other:
    
    - `npm-upgrade`: Upgrades all NPM dependencies to the latest version. Use this with caution. To be able to run this command, the global `npm-check-updates` dependency is required. Use `npm install -g npm-check-updates` to install.
    - `code`: Opens up one instance of Visual Studio Code
    - `new-page: Prompts the user for a new page name, and if age doesn't exists adds a new page and does all appropriate code changes.
    - `build-urls` - invokes .NET C# script that automatically creates `shared/urls.ts` file containing all application urls. Builds backend, executes script command and exists. This command will use `UrlBuilderPath` configuration key.
    - `build-models` - invokes .NET C# script that automatically creates `shared/models.d.ts` file containing all model interfaces from model namespace. Builds backend, executes script command and exists. This command will create a typescript file set in configuration key `TsModelsFilePath` (`shared/models.d.ts`) that will contain all C# public classes translated to Typescript interfaces, that are present in the namespace under `ModelNamespace` configuration key (`RazorSvelte.SampleData`).

## FAQ

### Can I debug these pages?

Yes. 

You can use your browser debug console for debugging as you would normally. The JavaScript needs to have an associated `.map` file.

To create a `.map` file run `rollup` and configuration file as argument commands with `-w` switch. For example:

`rollup -c ./Pages/Index.cshtml.js -w`

This command creates an uncompressed `wwwroot/build/index.js` file with an associated map that enables debugging in your browser.

In your browser sources tab, you will see your `App/index.svetle` typescript file that you can debug normally.

Also, this command will continue watching your source file(s) and will incrementally build as you continue to change it. 

### Building all pages is slow. Can I make it faster?

Yes. 

Don't use the "build all" command. Instead, use incremental build as described above in the previous question.

### Do I need NodeJS Development Server?

No, you don't need an external server. 

This project uses a built-in .NET web server.

However, you will need to have NodeJS and NPM installed to run Rollup commands.

### How can I use external logins from Google, LinkedIn, or GitHub from this example?

You will have to create a login app on these services to retrieve Client ID and Client Secret values and paste them to the configuration files.

- [https://console.cloud.google.com/apis/](https://console.cloud.google.com/apis/) for Google
- [https://www.linkedin.com/developers/apps/](https://www.linkedin.com/developers/apps/) for LinkedIn
- [https://github.com/settings/developers/](https://github.com/settings/developers/) for GitHub

See [appsettings.json](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/appsettings.json) for more details.

Once the authorization from external providers is passed, the application will use JWT auth for identities already confirmed by the external providers. So, you'll have to configure a `JwtConfigSection` with the values:

- `Secret` - long secret random string
- `Issuer` - JWT token issuer
- `Audience` - JWT token audience
- `ExpirationMin` - JWT token expiration time in minutes
- `ClockSkewMin` - Adds to the JWT token expiration time, set to null to avoid.
- `RefreshTokenExpirationMin` - Refresh token expiration minutes. Set to null to avoid using refresh tokens. If it is used, it must be longer than the token expiration to take effect.
- `CookieExpirationMin` - Cookie expiration in minutes. It must be longest than the token expiration or refresh token expiration if used.
- `CookieName` - Name of the security cookie.

Note: If using token refresh option, you might want to re-implement `RefreshTokenRepository` class to use the database or some kind of permanent cache, instead of an in-memory dictionary.

### Is page routing done on the client or the server?

Page routing is still handled on the server by the ASP.NET Web Server. 
That means that this project is not a Single-Page Application (SPA), although the entire markup is contained in the Svelte output which means it is cached on the client in a SPA manner.

However, one of the server routes `/spa` is an example of the SPA application. This page uses `svelte-spa-router` and shows various SPA views with the hashtag routes.

### Can I send data from my Razor Page to the Svelte component?

Yes, for example, by using hidden inputs.

1. Place `<input id="title" type="hidden" value="@ViewData["Title"]" />` in your page.
2. In your Svelte file:

```typescript
import { getValue } from "./shared/config";
let title = getValue<string>("title");
```

### Is this faster than the regular Razor Pages with JavaScript?

Besides being much easier and faster to develop and maintain, yes it is faster. The entire markup is contained and minified inside compiled JavaScript files from Svelte components which are then downloaded the first time and then cached for every new request.

This significantly reduces network traffic for your application.

Markup is then rendered instantly when the page loads.

### Are there any extensions you would recommend?

- For working with Svelte: [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- Also: [Svelte Intellisense](https://marketplace.visualstudio.com/items?itemName=ardenivanov.svelte-intellisense)
- For working with bootstrap: [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- Just for looking pretty: [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow)

## License
 
Copyright (c) Vedran Bilopavlović - VB Consulting and VB Software 2022
This source code is licensed under the [MIT license](https://github.com/vb-consulting/RazorSvelte/blob/master/LICENSE).
