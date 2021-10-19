# RazorSvelte

> Note: This project is migrated to **.NET6** RC1 and it is being constantly updated with improvements. See installation instruction to use earlier .NET5 template.

Project template repository containing a template project with the following setup:

- ASP.NET Razor Pages (C# and .NET5).
- Svelte JavaScript Framework configured for use with TypeScript and SCSS preprocessor.
- Rollup JavaScript bundler build system.
- Bootstrap 5 CSS framework configured for SCSS preprocessor.
- Sample authentication mechanism using (JWT using cookies with optional refresh tokens)  and with three external login providers (Google, Linkedin, and Github).
- Sample pages like index, privacy, login, logout, authorized sample page, unauthorized (401) and not found (404).

## Sample pages

- `/`: index page - show value from external props hello `world from svelte` and display useful links
- `/privacy` - privacy sample page, shows h1 title in a Svelte page passed from Razor Page ViewData.
- `/login` - show extarnal login buttons
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

- [Svelte](https://svelte.dev/) is a compiler that produces small and very much optimized JavaScript output.

- [Svelte](https://svelte.dev/) bundles your markup into compiler output as well, which is even smaller than what the normal markup would be.

- [Svelte](https://svelte.dev/) compiler output is then cached in the browser which makes every subsequent request even faster since the browser doesn't even have to download that markup again.

- Since [Svelte](https://svelte.dev/) produces pure vanilla JavaScript, there is no runtime overhead. This also means that you can import and bundle (with rollup) and runtime framework that you might need, perhaps to reuse the old UI components you might have. For example, legacy code with jQuery.

- [Svelte](https://svelte.dev/) has become most loved web framework for the developers in a 2021 year, according to the [StackOverflow survey](https://insights.stackoverflow.com/survey/2021#most-loved-dreaded-and-wanted-webframe-love-dread).

- [Rollup](https://rollupjs.org/guide/en/#the-why) is already pre-configured to run with the ASP.NET project, compile, bundle and remove unused modules, and then output into your `wwwroot` of your ASP.NET project.

- You can also continue using the normal ASP.NET Razor Pages (or MVC) as you normally would.

The result is an ***very much optimized web application*** with:
- The Backend is served by the ASP.NET.
- The front end is rendered and optimized by Svelte and Rollup.

And, you can combine server-side rendering with optimized Svelte front-end rendering.

Best of all - you can avoid tedious configuration by using this template.

## Installation

### From the command-line:

#### Main template

```
$ npx degit vb-consulting/RazorSvelte
> cloned vb-consulting/RazorSvelte#HEAD
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

If you want some other template rather than the main template (like jQuery or NET5 example) - change the brach first.

## Structure

#### Razor Pages Structure

Each Razor Page has two new nested files:

- `MyPage.rollup.config.js` - rollup configuration file for this page.
- `MyPage.entry.ts` - entry point typescript module file for this page.

Note:

- Those two new files are dependent on the `MyPage.cshtml` (via project file settings) so that IDE's like VisualStudio and JetBrains Rider would nest them visually. 
- Nesting of this type is not currently supported by the Visual Studio Code. 

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

Once the authorization from external providers passed, the application will use JWT auth for identites already confirmed by the external providers. So, you'll have to configure a `JwtConfigSection` with values:

- `Secret` - long secret random string
- `Issuer` - JWT token issuer
- `Audience` - JWT token audiance
- `ExpirationMin` - JWT token expiration time in minutes
- `ClockSkewMin` - Adds to the JWT token expiration time, set to null to avoid.
- `RefreshTokenExpirationMin` - Refresh token expiration minutes. Set to null to avoid using refresh tokens. If it is used, it mused be longer than token expiration to take effect.
- `CookieExpirationMin` - Cookie expiration in minutes. Irt must be longet than token expiration or refresh token expiration if used.
- `CookieName` - Name of the security cookie.

Note: If using token refresh option, you might want to re-implement `RefreshTokenRepository` class to use database or some kind of permantet cache, instead of in-memory dictionary.

### Is page routing done on the client or the server?

Page routing is still handled on the server by the ASP.NET Web Server. 
That means that this project is not a Single-Page Application (SPA), although the entire markup is contained in the Svelte output which means it is cached on the client in a SPA manner.

However, one of the server routes `/spa` is an example of the SPA application. This page uses `svelte-spa-router` and shows various SPA views with the hashtag routes.

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

## Changes

### 2021-10-19

#### NPM Upgrade

```
 @rollup/plugin-node-resolve  ^13.0.5  →  ^13.0.6
 @rollup/plugin-typescript     ^8.2.5  →   ^8.3.0
 bootstrap                     ^5.1.2  →   ^5.1.3
 sass                         ^1.42.1  →  ^1.43.2
 svelte                       ^3.43.1  →  ^3.44.0
 svelte-check                  ^2.2.6  →   ^2.2.7
 typescript                    ^4.4.3  →   ^4.4.4
```

#### MapFallback skips api segment

```csharp
app.MapFallback(context =>
{
    if (!context.Request.Path.StartsWithSegments(Urls.ApiSegment))
    {
        context.Response.Redirect(Urls.NotFoundUrl);
    }
    return Task.CompletedTask;
});
```

### 2021-10-06

#### NPM Upgrade

```
 bootstrap                ^5.1.1  →  ^5.1.2
```

#### Request Localization Support

Two new configuration keys:

```
  "EnableBrowserRequestLocalization": true,
  "DefaultCulture": "en-US",
```

If `EnableBrowserRequestLocalization` is enabled, every server-side request thread will have culture set match default culture from your browser. Chromium brosers: Settings -> Languages -> Language.

Value is represented as `Accept-Language` request header and [lambda routine](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/Program.cs#L63)  will always take the first value from comma separated string.

If culture is not supported or `Accept-Language` not present, `DefaultCulture` will be used as fallback.

This can be used to implement localization to your application (perhaps from the database or cookie).

### 2021-10-02

- Added (returned) "prebuild" event in .csproj project files that rebuilds entire frontend for production only for Release build configuration.

- Small cleanup in external login code.

- Upgraded NPM libraries:

```
 @rollup/plugin-commonjs  ^20.0.0  →  ^21.0.0     
 rollup                   ^2.57.0  →  ^2.58.0     
 svelte                   ^3.43.0  →  ^3.43.1     
 svelte-preprocess         ^4.9.5  →   ^4.9.8
```

- Added prefixes to NPM scrpt task names. This done so that NPM IDE tools that doesn't resepect order can group tasks properly (looking at you Task Runner Explorer). Prefixes are:
    - `dotnet-` for all dotnet tasks
    - `frontend-` for all frontend tasks (building css, js)
    - `npm-` for all npm tasks (audit, upgrade)


#### Added support for the localization:

Two new configration keys:

- `"EnableBrowserRequestLocalization": true,`
- `"DefualtCulture": "en-US",`

If the `EnableBrowserRequestLocalization` is enabled then server-side request threads will be set to use the same culture as designated by your browser (Chromium browsers: Settings -> Languagues -> Languague).

Each request will run custom request culture provider routine that will set the request thread from the first entry (comma sperated) - in the `Accept-Language` request header (that is basically set in your browser options).

If selected culture is missing or not supported, than `DefualtCulture` fallback will be used.

This can be further customized to support localization that will use user selection (from database, cookie, etc).

#### NPM Upgrade:
```
bootstrap  ^5.1.1  →  ^5.1.2     
```

### 2021-09-27

- Added `dotnet-watch` command that runs `dotnet watch`. `dotnet watch` in .NET6 in combination with Rollup watch is amazing, you see changes immidiatly when you save the file.

- Changed naming convention of Svelte components to pascal casing ("PascalCasing"), because that seems to be default convention for all Svelte components.

## Licence
 
Copyright (c) Vedran Bilopavlović - VB Consulting and VB Software 2021
This source code is licensed under the [MIT license](https://github.com/vb-consulting/RazorSvelte/blob/master/LICENSE).
