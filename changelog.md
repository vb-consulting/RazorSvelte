# Changes

## 2023-03-25

### `lib` directory restructured

- Components and modules moved to subdirs and new aliases created
- Every subdir has its own import alias
- Subdirs:
  - `$lib/area/`, "$area/": area components like card, placeholder, tabs...
  - `$lib/charting/`, `$charting/`: charting components like chart and chat box...
  - `$lib/data/`, `$data/`: data-aware components like data table and data pagers...
  - `$lib/element/`, `$element/`: components over other elements like tooltips and popovers...
  - `$lib/forms/`, `$forms/`: form elements like text inputs, search input, multiple select, radios, etc...
  - `$lib/overlay/`, `$overlay/`: components that create an overlay over the screen like modal, off-canvas, etc...
  - `$lib/visual/`, `$visual/`: visual enhancements like icons, starred rating, etc... 
  - `$lib/layouts/`, `$layouts/`, `$layout/`: different layout implementations with different menus and navigations that can be used in main `$shared/layout`.

### `build-all` script (`fe-build-all` command) removes everything from `build` dir

### Fixed scripts for newer versions of NodeJS

Fixed Implicit coercion to integer for exit code is deprecated on process exit.

### Themes

- Defined theme type: 

```
type ThemesType =
    | "light"
    | "dark";
```

- Init module returns the current theme. You can use that prop on any page:

```
    export let theme: ThemesType;
```

- Theme module returns writable `theme` and all available themes array: `export const themes: ThemesType[] = [light, dark];`

### Fix new-page script

- HTML Layout consistent with default formatter
- Solved race condition between npm run build-urls and npm run fe-build name

### Docker demo

- Added Dockerfile that will pull the latest code on build and run the demo application
- See Dockerfile for more details

Follow these steps to build and run the RazorSvelte demo application:

1. Download the Dockerfile from https://github.com/vb-consulting/RazorSvelte/blob/master/Dockerfile (or just run wget https://github.com/vb-consulting/RazorSvelte/blob/master/Dockerfile from the command prompt)

2. Open a command prompt and navigate to the folder where you saved the Dockerfile

3. Run the following commands:

`docker build -t razorsvelte .`
`docker run --rm -it -p 5000:80 --name razorsvelte razorsvelte:latest`

4. Navigate to http://localhost:5000/

### Updated NPM Packages

```
 @material-design-icons/font        ^0.14.3  →   ^0.14.4
 @typescript-eslint/eslint-plugin   ^5.55.0  →   ^5.56.0
 @typescript-eslint/parser          ^5.55.0  →   ^5.56.0
 eslint-config-prettier              ^8.7.0  →    ^8.8.0
 npm-check-updates                 ^16.7.12  →  ^16.7.13
 prettier                            ^2.8.4  →    ^2.8.7
 rollup                             ^3.19.1  →   ^3.20.2
 npm-check-updates                 ^16.7.13  →   ^16.8.0
 prettier-plugin-svelte              ^2.9.0  →   ^2.10.0
 sass                               ^1.59.3  →   ^1.60.0
```

## 2023-03-19

### Init module improvement

- Now init module returns current user by default. 
- Since anything that is returned from init module is passed as props to the page, now every page can include this following export to gain access to a user.

```ts
    export let user: IUser;
```

### Improved tabs component

- Now accepts tabs taht are links {text, href} | string
- Fixed coloring with material bootstrap skin
- SPA demo uses tabs component

### Reconfigured prettier

Now format command will not 

```
<tag
    prop1="value1"
    prop2="value2"
>
</tag>
```

but, instead

```
<tag
    prop1="value1"
    prop2="value2">
</tag>
```

### Some styling issues

- Reverted popover and tooltip styles to bootrtrap default.

### Improve offcanvas-layout component

- Implemented diminishing on scroll header with nice animation.
- Fixed shadows.

### Added popover component

- New component:

```
import Popover from "$lib/popover.svelte";
```

Implementation of Bootrap popover element, a sort of tooltip on stereoids.

This wrapper allows you to define a a popover content and/or popover title as svelte component slots while retaining all of the svelte interactivity (events) and reactivity as well.

For example:

```
<Popover trigger="click">
    <div slot="title">
        title
        <div on:click={() => console.log("click")}>div1</div>
    </div>
    <button
        class="btn btn-sm btn-primary mx-1"
        on:click={() => ($isDarkTheme = !$isDarkTheme)}
        data-bs-toggle="tooltip"
        title={$isDarkTheme ? "Lights On" : "Lights Off"}>
        <Icon material={$isDarkTheme ? "light_mode" : "dark_mode"} materialType="outlined" />
    </button>
    <div>div1</div>
    <div>div2</div>
</Popover>
```

Also, you don't need to specifiy element with popover (but you can), and if you don't, previous element will have a popover.

### Added icon component and icon types

- New component:

```
import Icon from "$lib/icon.svelte";
```

With props:

- element: HTML Element tag name, default is `i`.
- bootstrap: bootstrap icon name.
- material: material icon name.
- materialType: material icon type: "filled" | "outlined" | "round" | "sharp" | "two-tone", default is "filled".

Bootstrap and material icon can be mixed, but why?

To offer IntelliSense autocompletation on these icon types (bootstrap or material), NPM postinstall script will create file `$lib/ts/icons.d.ts` with all icon types for bootstrap (`BootstrapIconsType`) and material icons (`MaterialIconsType`).

These types are typescript types and server only for IDE and compile time and won't be bundled into output.

Also, new `icon` component can receive any valid HTML attribute. Svelte Events are not supported.

### New extension recommendation

Default list in `.vscode/extensions.json` is expanded to support `Zignd.html-css-class-completion` which will be recommended for this type of project.

This extension provides IntelliSense for class names in all HTML editors. Very useful.

### Reorganized lib dir

- TS filess moved to ts subdir, and removed underscore
- _styles.scss moved to scss subdir and broken up to components
- added layouts dir for different layouts implememntation

### Configured import aliases

- Alias `$lib` for all modules in `lib` directory (same alias exists in SvelteKit). 
- Alias `$shared` for all modules in `shared` directory.
- Alias `$layout` for different layouts implementation (those not used are not bunlded thanks to rollup tree shaker).

You can do `import MyConpoment from $lib/component` from any location in project, rollup and Visual Studio Code are configured to resolve correct directory automatically. 

This is made available with `@rollup/plugin-alias` rollup plugin NPM.

### Fix name styling on backend

### Updated NPM Packages

IMPORTANT:

Since TypeScript has major version upgrade to version 5, compiler (and rollup TS plugin `@rollup/plugin-typescript`) started to issue following warnings:

```
tsconfig options "importsNotUsedAsValues" and "preserveValueImports" are deprecated. Either set "ignoreDeprecations" to "5.0" in your tsconfig.json to silence this warning, or replace them in favor of the new "verbatimModuleSyntax" flag.
```

To prevent this `"ignoreDeprecations": "5.0"` was added to compiler options. Hopefully this issue will be addressed in fuiture versions of `@rollup/plugin-typescript` plugin.

```
 typescript                         ^4.9.5  →  ^5.0.2
 @typescript-eslint/eslint-plugin  ^5.54.1  →  ^5.55.0
 @typescript-eslint/parser         ^5.54.1  →  ^5.55.0
 svelte-check                       ^3.1.2  →  ^3.1.4
 sass                              ^1.59.2  →  ^1.59.3
 svelte-preprocess                  ^5.0.1  →  ^5.0.3
 svelte                            ^3.56.0  →  ^3.57.0
```

## 2023-03-11

### Fix type NodeJS.Timeout to normal type number for timeouts

### Cleanup code C# with Resharper

### Fix theme-ing on external login loading page 

### Updated NPM Packages

```
 eslint              ^8.35.0  →   ^8.36.0
 npm-check-updates  ^16.7.10  →  ^16.7.12
 rollup              ^3.18.0  →   ^3.19.1
 sass                ^1.58.3  →   ^1.59.2
 svelte              ^3.55.1  →   ^3.56.0
 svelte-check         ^3.1.0  →    ^3.1.2
```

## 2023-03-09

### Changes in build system

Under certain circumstances command `npm run build-all` which builds all pages can cause problems. 
For example error message `Error: ENOENT: no such file or directory, unlink '/RazorSvelte/Pages/rollup.config-1678356160914.cjs'`

Rollup tends to create temporary files which can cause problems when running multiple builds in parallel.

The solution is to run build all pages in serial rather in parallel first. And then subsequent calls to normal parallel `npm run build-all` goes without error.

In any case, there is a new configuration switch in `/Scripts/config.js` -> `parallelBuild: true` that can be turned off or on for parallel mode in `npm run build-all` command.

Also, `npm run build-all` runs format and lint first, based on linting and format rules set in `.eslintrc.cjs` and `.prettierrc`.

## 2023-03-08

### Added lint and format (prettier) support

New commands:

- `npm run lint` - run lint on entire project.
- `npm run format` - run prettier on entire project.

Linter and format made available by following new dependencies:

```
 @typescript-eslint/eslint-plugin  ^5.45.0  →  ^5.54.1
 @typescript-eslint/parser         ^5.45.0  →  ^5.54.1
 eslint                            ^8.28.0  →  ^8.35.0
 eslint-config-prettier             ^8.5.0  →   ^8.7.0
 prettier                           ^2.8.0  →   ^2.8.4
 prettier-plugin-svelte             ^2.8.1  →   ^2.9.0
```

Notes:

- Prettier uses 4 whitespaces and double quotes. See `.prettierrc` file.
- Linter allows inferrable types, explicit any types, the use of undeclared variables (important for Svelte props) and doesn't ban type declaration with the `{}` (important for Svelte slots). See `.eslintrc.cjs` file.

### Updated NPM Packages

```
 svelte-check  ^3.0.4  →  ^3.1.0
```

## 2023-03-05

### Added Scripts Configuration

- See at https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/Scripts/config.js
- Improved scripts

### Added Material Icons

- Along existing Bootstrap Icons (https://icons.getbootstrap.com/), you can now use material icons too.
- Lightweight NPM `"@material-design-icons/font": "^0.14.3",` is added from `https://github.com/marella/material-design-icons/tree/main/font`.
- Reference is added to component see https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/App/scss/material-bootstrap.scss
- To search icon gallery go to https://fonts.google.com/icons or https://marella.me/material-design-icons/demo/font/
- Five types of material icons: filled, outlined, round, sharp or two tone.

### Material Bootsrap Style

- Style sheet has been updated with `mdb-ui-kit` free scss component which is material bootstrap style implementation.
- Added `"mdb-ui-kit": "^6.2.0"` NPM
- To switch style build between classic bootstrap, inside "./App/scss/style.scss" import `@import "bootstrap";` or import `@import "material-bootstrap";` as needed.
- Material bootstrap looks better. The end.
- `mdb-ui-kit` implementation is pretty lightweight and open under MIT licence.

### Fix offcanvas layout component

- Removed monospace font on title
- Fix pin button z index issue when pinned

### Added title prop on layout component 

### Updated NPM Packages

- `rollup-plugin-svelte` fixed annoying warning message.

```
 rollup-plugin-svelte  ^7.1.3  →  ^7.1.4
```

## 2023-04-03

### `shared/init`

- Added `shared/init` module which is called before initializaion of every page. This module injects shared configuration values (sent by hidden fields from server page) and it can be further customized to shared initialization logic.

- Module has only one default export `init` which receives a razor page name without extension (Index, Login, Logout, etc). 

### Reorganized `lib` directory

- `_config.ts` - shared configuration (injected on init)
- `_fetch.ts` - fetch functionalities and server comms
- `_functions.ts` - shared functions.
- `_styles.scss` - shared styles, imported by main style build `scss/style.scss`
- `_type.d.ts` - shared types

- Added underscore for easier navigation (always on top).

### Script fixes

- `build` watch` scripts (fe-build and fe-watch npm commands) will propmpt input if page name is not supplied instead of building index
- fixed watching scss styles on watch all command.

### New commands and .NET scripts

- Two new commands:
  - `build-urls` - invokes .NET C# script that automatically creates `shared/urls.ts` file containing all application urls. Builds backend, executes script command and exists. This command will use `UrlBuilderPath` configuration key.
  - `build-models` - invokes .NET C# script that automatically creates `shared/models.d.ts` file containing all model interfaces from model namespace. Builds backend, executes script command and exists. This command will create typescript file set in configuration key `TsModelsFilePath` (`shared/models.d.ts`) that will contain all C# public classes translated to Typescript interfaces, that are present in namespace under `ModelNamespace` configuration key (`RazorSvelte.SampleData`).

## Removed version tag from csproj

- No sense of having that in a template project. Reverted to commits by date. I am the solo developer on this project after all (afaik).

## New component examples and demos

- Gradually adding those. One day I might have an NPM package of my own. I wish I had more time for this.

### Updated NPM Packages

```
 npm-check-updates      ^16.7.4  →   ^16.7.10
 rollup                 ^3.15.0  →   ^3.18.0
 rollup-plugin-svelte   ^7.1.2   →   ^7.1.3
 sass                   ^1.58.0  →   ^1.58.3
 svelte-check           ^3.0.3   →   ^3.0.4
```

## 2023-02-11

### Updated NPM Packages

```
 chart.js               ^4.2.0  →   ^4.2.1
 npm-check-updates     ^16.6.3  →  ^16.7.4
 rollup                ^3.12.0  →  ^3.15.0
 rollup-plugin-svelte   ^7.1.0  →   ^7.1.2
 sass                  ^1.57.1  →  ^1.58.0
 typescript             ^4.9.4  →   ^4.9.5
```

### Massive improvements on Chart and ChartBox Components

And the Demo page is improved too.

## [1.1.1]

### Updated NPM Packages

```
 @rollup/plugin-terser   ^0.3.0  →   ^0.4.0
 npm-check-updates      ^16.6.2  →  ^16.6.3
 rollup                 ^3.10.1  →  ^3.12.0
 svelte-check            ^3.0.2  →   ^3.0.3
 tslib                   ^2.4.1  →   ^2.5.0
```

## [1.1.0]

### Fix/improve new page script 

### Set dark theme as default

### Move sample data to `SampleData`

### Improve minimal API managament

### Components folder name change

From `/shared/components` to `/lib`. Name `components` is presreved for application levevel components. 

### New Components:

- `starred-score.svelte`
- `file-selector.svelte`

### Component updates:

- `pager.svelte` - New prop: `prevNextButtons`

### Updated NPM Packages

```
 @rollup/plugin-commonjs    ^24.0.0  →  ^24.0.1
 @rollup/plugin-terser       ^0.2.1  →  ^0.3.0
 @rollup/plugin-typescript  ^10.0.1  →  ^11.0.0
 chart.js                    ^4.1.1  →  ^4.2.0
 rollup                      ^3.9.0  →  ^3.10.1
 svelte                     ^3.55.0  →  ^3.55.1
 svelte-check                ^3.0.1  →  ^3.0.2
 svelte-preprocess           ^5.0.0  →  ^5.0.1
 ```


## [1.0.5](https://github.com/vb-consulting/RazorSvelte/tree/1.0.5) (2022-12-30)

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/1.0.4..1.0.5)

### Updated NPM Packages

```
 @rollup/plugin-commonjs  ^23.0.4  →  ^24.0.0
 @rollup/plugin-replace    ^5.0.1  →   ^5.0.2
 @rollup/plugin-terser     ^0.2.0  →   ^0.2.1
 bootstrap-icons          ^1.10.2  →  ^1.10.3
 chart.js                  ^4.0.1  →   ^4.1.1
 npm-check-updates        ^16.5.6  →  ^16.6.2
 rollup                    ^3.7.3  →   ^3.9.0
 sass                     ^1.56.2  →  ^1.57.1
 svelte                   ^3.54.0  →  ^3.55.0
 svelte-check             ^2.10.2  →   ^3.0.1
 typescript                ^4.9.3  →   ^4.9.4
```

### Upgraded Bootstrap to 5.3.0-alpha1

Bootstrap version 5.3.0 now supports natively - themes, color modes and [dark mode](https://getbootstrap.com/docs/5.3/customize/color-modes/#dark-mode)

This simplifies greatly scss styles, since dark mode is implemented nativly and it is no longer in separated stylesheets.

### Fix: NPM commands `fe-build-all` and `fe-watch-all`

Fixed two scripts `build-all.js` and `watch-all.js` that those commands invoke. 
Now, they will first empty destination `build` directory if there are some old files there. 
This seems to fix some wierd and rare warnings in rollup builds.

## [1.0.4](https://github.com/vb-consulting/RazorSvelte/tree/1.0.4) (2022-12-12)

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/1.0.3..1.0.4)

### Added updating document title from title prop in offcanvas layout

### Updated NPM Packages

```
 @rollup/plugin-commonjs  ^23.0.3  →  ^23.0.4
 npm-check-updates        ^16.5.0  →  ^16.5.6
 rollup                    ^3.6.0  →   ^3.7.3
 sass                     ^1.56.1  →  ^1.56.2
 svelte-check             ^2.10.1  →  ^2.10.2
 svelte-preprocess        ^4.10.7  →   ^5.0.0
 typescript                ^4.9.3  →   ^4.9.4
```

### Added charp script `/Scripts/UrlBuilder`

This script will produce `./App/shared/urls.ts` file that contianis all URL's from the application:

```ts
/*auto generated*/
export default {
    authorizedUrl: "/authorized",
    signInGitHubUrl: "/signin-github",
    signInGoogleUrl: "/signin-google",
    signInLinkedInUrl: "/signin-linkedin",
    errorUrl: "/error",
    indexUrl: "/",
    loginUrl: "/login",
    logoutUrl: "/logout",
    notFoundUrl: "/404",
    privacyUrl: "/privacy",
    spaUrl: "/spa",
    unathorizedUrl: "/401",

    chart1Url: "/api/chart/1",
    chart2Url: "/api/chart/2",
    chart3Url: "/api/chart/3",
}
```

It can be run with `dotnet run -- build-urls` or `npm run build-urls`.

Since this script can generate stronlgy typed url's, all urls's are moved closer to actual pages and endpoints. For example:

```cs
namespace RazorSvelte.Pages;

public partial class Urls
{
    public const string IndexUrl = "/";
}

public class IndexModel : PageModel {}
```

And the page has the route attribute as before:

```cshtml
@page
@attribute [RazorCompiledItemMetadata("RouteTemplate", Urls.IndexUrl)]
@model IndexModel
@{
    ViewData["Title"] = "Home page";
}

@section HeadSection {
    <link href="~/build/index.css" asp-append-version="true" rel="stylesheet" />
    <script defer src="~/build/index.js" asp-append-version="true"></script>
}
```

This eliminates need to add manually another url to application - it is already there when command is invoked.

It also eliminates need for `newtonsoft.json` library.

### Removed `newtonsoft.json` from depencies

### Removed Auth area and moved it to Auth subdir under Pages

### Update components library with lates changes and fixes

See [Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/1.0.3..1.0.4) for details.

## [1.0.3](https://github.com/vb-consulting/RazorSvelte/tree/1.0.3) (2022-12-07)

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/1.0.2..1.0.3)

### Updated NPM Packages

```
 @rollup/plugin-commonjs    ^23.0.2  →  ^23.0.3
 @rollup/plugin-terser       ^0.1.0  →   ^0.2.0
 @rollup/plugin-typescript   ^9.0.2  →  ^10.0.1
 npm-check-updates          ^16.4.3  →  ^16.5.0
 rollup                      ^3.4.0  →   ^3.6.0
 svelte                     ^3.53.1  →  ^3.54.0
 svelte-check                ^2.9.2  →  ^2.10.1
```

### Theme cookie path fixed

Fixed theme selection cookie to work eqaually on all application paths (added `path=/`)

### New components:

#### `card` - bootstrap card wrapper with additional label

Examples:

```jsx
<Card 
    label="Company Info"
    title={company.name}
    subtitle={company.companyline}>

    <div>...content</div>

    <div slot="footer">
        <button class="btn btn-sm btn-primary">
        <i class="bi-pencil"></i>
        Edit
        </button>
    </div>
</Card>
```
```jsx
<Card label="About" class="mt-3">
    {company.about}
</Card>
```

#### `tabs` - bootstrap tab implementation

```
<Tabs tabs={["Employees", "Reviews"]} class="mt-3" let:active>
{#if active == "Employees"}
    Employees
{:else if active == "Reviews"}
    Reviews
{/if}
</Tabs>
```

#### `tokens` - visual representation of id and name data arrays using rounded pill badges


```jsx
<Tokens tokens={company.areas} />
```
```jsx
<Tokens 
    tokens={data.areas} 
    disabled={grid.working}
    selected={token => areas.containsKey(token.id)} 
    click={areaTokenClick} 
    tooltip={areaTooltip}
/>
```
```jsx
<Tokens 
    tokens={data.areas} 
    tooltip={token => `Filter companies by ${token.name}`}
    href={token => parseUrl(urls.companiesUrl, {area: JSON.stringify({value: token.id, name: token.name})})} 
/>
```

## [1.0.2](https://github.com/vb-consulting/RazorSvelte/tree/1.0.2) (2022-11-24)

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/1.0.1..1.0.2)

### Added Card component

Simple Bootstrap Card, wrapped up to Svelte component.

### Updated NPM Packages

```
 bootstrap            5.2.2  →    5.2.3
 npm-check-updates  ^16.4.1  →  ^16.4.3
 rollup              ^3.3.0  →   ^3.4.0
```

- This fixes SCSS warnings.

## [1.0.1](https://github.com/vb-consulting/RazorSvelte/tree/1.0.1) (2022-11-12)

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/1.0.0..1.0.1)

Fix redirection on fetch module.

## [1.0.0](https://github.com/vb-consulting/RazorSvelte/tree/1.0.0) (2022-19-11)

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/0.0.9..1.0.0)

### New Versioning System

- From this update, each update is tagged with the appropriate version. The previous version is `0.0.9` and this is version `1.0.0`.

- Each version update will be committed into a separate branch with compare like supplied in the changelog (see header).

- In addition, the project file will also contain a version tag `<Version>1.0.0</Version>` in a first `PropertyGroup`.

### .NET7

- Project is upgraded to .NET7. For .NET6, see the previous version.

### New Minimal Endpoints Design.

- Namespace/dir moved from `Data` to `Endpoints`.
  
- Added generic `EndpointBuilder` which uses reflection to build endpoints: 

```csharp
namespace RazorSvelte.Endpoints;

public static class EndpointBuilder
{
    public static void ConfigureEndpoints(this WebApplicationBuilder builder)
    {
        foreach (var method in typeof(Endpoints).GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
        {
            var p = method.GetParameters();
            if (p.Length == 1 && p[0].ParameterType == typeof(WebApplicationBuilder))
            {
                method.Invoke(null, new[] { builder });
            }
        }
    }

    public static void UseEndpoints(this WebApplication app)
    {
        foreach (var method in typeof(Endpoints).GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
        {
            var p = method.GetParameters();
            if (p.Length == 1 && p[0].ParameterType == typeof(WebApplication))
            {
                method.Invoke(null, new[] { app });
            }
        }
    }
}
```

This allows feature splitting/separation, for example, it's only needed to add `Endpoints` class and appropriate `Configure` (having a `WebApplicationBuilder` parameter) and `Use` (having a `WebApplication` parameter) will be called, and built. For example: `ChartEndpoints.cs`:

```csharp
public partial class Endpoints
{
    public static void ConfigureChartEndpoints(WebApplicationBuilder builder)
    {
       // configure charts and chart endpoints here
    }

    public static void UseChartEndpoints(WebApplication app)
    {
       // map chart endpoints here
    }
}
```

Endpoints in this template project are used to demonstrate the usage of various Svelte components.

### Fixed Warnings in `AuthBuilder.cs`

### Updated NPM Packages

```
 @rollup/plugin-commonjs       ^23.0.0  →  ^23.0.2
 @rollup/plugin-node-resolve   ^15.0.0  →  ^15.0.1
 @rollup/plugin-replace         ^5.0.0  →   ^5.0.1
 @rollup/plugin-typescript      ^9.0.1  →   ^9.0.2
 @types/bootstrap               ^5.2.5  →   ^5.2.6
 bootstrap-icons                ^1.9.1  →  ^1.10.2
 chart.js                       ^3.9.1  →   ^4.0.1
 npm-check-updates            ^16.3.13  →  ^16.4.1
 rollup                         ^3.2.2  →   ^3.3.0
 rollup-plugin-css-only         ^3.1.0  →   ^4.3.0
 sass                          ^1.55.0  →  ^1.56.1
 svelte                        ^3.52.0  →  ^3.53.1
 tslib                          ^2.4.0  →   ^2.4.1
 typescript                     ^4.8.4  →   ^4.9.3
```

- Removed `"rollup-plugin-terser": "^7.0.2"` (no longer maintained) and replaced with "the official" implementation `"@rollup/plugin-terser": "^0.1.0"`. Terser is the JavaScript minifier.


### Scripts Changes:

- `build-all.js` and `watch-all.js`:
  - Output to a console system command.
  - Start rollup with `npx rollup` always. This allows for direct calls without the NPM RUN command, like `node .\Scripts\build-all.js`, etc.

- New script: `build.js`
  - Builds specified page from the argument.
  - Argument page name is a lowercased config file without extensions. For example `index` for `./Pages/Index.rollup.config.js`, `login` for `./Pages/Login.rollup.config.js`, etc.
  - If no argument is specified, builds the `index` by default.
  - Include `-w` or `--watch` for incremental build and watch for changes.

### NPM Command Changes

- Commands `fe-build-index` and `fe-watch-index`˙removed.
- Commands `fe-build` and `fe-watch` added.

New commands are doing the same thing as previous commands, only via script and they can accept arguments as described in script changes above (e.g. `npm run fe-build login`).

### New Svelte Components

New UI components are being added constantly. See the [`App/shared/components/`](https://github.com/vb-consulting/RazorSvelte/tree/master/RazorSvelte/App/shared/components) dir.

These components are developed in different projects and are added as they are tested and used. 
They are still under development and some documentation may be lacking. To see usage example for these components see [this project](https://github.com/vb-consulting/postgresql-driven-development-demo/tree/master/PDD.WebApp) 

New components for this version include:

- `data-grid` - data grid that can work with pager and async data source.
- `multiselect` - customizable multiple select dropdowns with scroll loading for big datasets.
- `pager` - pager component that knows how to work with `data-grid`.
- `placeholder` - loading placeholder based on the bootstrap placeholder, mostly used by other components to manage un-initialised state.
- `search-input` - simple search input with a search icon that handles search timeouts and prevents multiple search requests.

# Older Changelogs

## 2022-10-17

- Update NPM packages:
```
 @rollup/plugin-commonjs      ^22.0.2  →   ^23.0.0
 @rollup/plugin-node-resolve  ^14.1.0  →   ^15.0.0
 @rollup/plugin-replace        ^4.0.0  →    ^5.0.0
 @rollup/plugin-typescript     ^8.5.0  →    ^9.0.1
 @types/bootstrap              ^5.2.4  →    ^5.2.5
 bootstrap                      5.2.1  →     5.2.2
 npm-check-updates            ^16.3.4  →  ^16.3.13
 rollup                       ^2.79.1  →    ^3.2.2
 svelte                       ^3.50.1  →   ^3.52.0
 svelte-check                  ^2.9.1  →    ^2.9.2
```

- Solve migration issue for rollup 3+.

- Fix authorization in app builder.

## 2022-09-30

- Added new Script `new-page.js` and associated NPM command `new-page`.

This script will prompt for the new page name and then add all required files, configure application and add new layout item.

Example adding test page:

```
❯ npm run new-page
> new-page
> node ./Scripts/new-page.js

Enter new page name: Test
Added URL key TestUrl = "/test" to file './Pages/_Urls.cs'
File created: ./Pages/Test.cshtml
File created: ./Pages/Test.cshtml.cs
File created: ./Pages/Test.entry.ts
File created: ./Pages/Test.rollup.config.js
Added new nesting to ./RazorSvelte.csproj
File created: ./App/test.svelte
Added URL key 'testUrl: string;' to file './App/shared/config.ts'
Added list item to file: './App/shared/layout/link-list-items.svelte'
```

- NPM Upgrade:

```
 npm-check-updates  ^16.3.3  →  ^16.3.4
```

## 2022-09-29

- Remove obsolete command `npm frontend-build-all` or release build.

- NPM Upgrade:

```
 npm-check-updates  ^16.2.1  →  ^16.3.3
 rollup             ^2.79.0  →  ^2.79.1
 sass               ^1.54.9  →  ^1.55.0
 svelte-check        ^2.9.0  →   ^2.9.1
 typescript          ^4.8.3  →   ^4.8.4
```

## 2022-09-21

- NPM Upgrade:

```
 @rollup/plugin-node-resolve  ^13.3.0  →  ^14.1.0
 @rollup/plugin-typescript     ^8.4.0  →   ^8.5.0
 @types/bootstrap              ^5.2.3  →   ^5.2.4
 bootstrap                      5.2.0  →    5.2.1
 rollup                       ^2.78.1  →  ^2.79.0
 sass                         ^1.54.6  →  ^1.54.9
 svelte                       ^3.49.0  →  ^3.50.1
 typescript                    ^4.8.2  →   ^4.8.3
 npm-check-updates            ^16.0.6  →  ^16.2.1
```

- Fix error page broken layout

## 2022-08-30

- Fix readme
- NPM Upgrade:

```
 sass          ^1.54.5  →  ^1.54.6
 svelte-check   ^2.8.1  →   ^2.9.0
```

- Simplify and restructure Program.cs and .net program structure.

## 2022-08-28 (2)

- Move `get` out of chart-box component and use `dataFunc` prop
- Add configurable title

## 2022-08-28

- Fix config mess and improve client side config and error page.
- Fix logged in username style.

## 2022-08-27

- Redirect to error page on fetch data error.

- Move Url partial class to Pages dir.

- Nuget upgrade: 

```
    Microsoft.AspNetCore.Authentication.JwtBearer" Version="6.0.6 to Microsoft.AspNetCore.Authentication.JwtBearer" Version="6.0.8
```

- NPM Upgrade:

```
 @rollup/plugin-typescript   ^8.3.4  →   ^8.4.0
 @types/bootstrap            ^5.2.1  →   ^5.2.3
 rollup                     ^2.77.3  →  ^2.78.1
 sass                       ^1.54.4  →  ^1.54.5
 svelte-check                ^2.8.0  →   ^2.8.1
 typescript                  ^4.7.4  →   ^4.8.2
 npm-check-updates          ^16.0.5  →  ^16.0.6
```

## 2022-08-13

- Added `npm-check-updates` npm utility to dev dependecies so that command `npm-upgrade` doesn't depend globally on this package.

## 2022-08-12

- NPM Upgrade:

- Fix offcanvas navigation hover style on links.

- Fix borders on login page.

```
 rollup             ^2.77.2  →  ^2.77.3     
 sass               ^1.54.3  →  ^1.54.4     
 svelte-spa-router   ^3.2.0  →   ^3.3.0     
```

## 2022-08-05

- Fixed postinstall script to copy new fonts if bootstrap icons was upgraded.

- Fixed broken pinned layout on pages other then index.

- NPM Upgrade:

```
 @rollup/plugin-commonjs  ^22.0.1  →  ^22.0.2     
 chart.js                  ^3.9.0  →   ^3.9.1     
 sass                     ^1.54.1  →  ^1.54.3     
```

## 2022-08-03

- NPM Upgrade:

```
@types/bootstrap    ^5.2.0   →  ^5.2.1     
sass                ^1.54.0  →  ^1.54.1     
```

- New NPM Package:

```
chart.js            ^3.9.0
```

- Removed footer control from offcanvas layout. Doesn't work well with pinned layout.

- Fixed offcanvas layout so that links and pin buton are fixed when content height exceeds the screen size.

- Changed logic of pin button on title on offcanvas layout - when pinnedm, clicking will unpin.

- Fixed small type problem with IComponentModalButton interface for Modal component.

- Added new slot for the Modal component `header`. Adds custom html markup to modal header without wrapping it to `modal-header` element.

- Two new components for sharting that are using `chart.js` library (demo on index page):

1) `components/chart.svelte` - basic charting component, encapuslates charting fro`chart.js` library

2) `components/chart-box.svelte` - uses `chart.svelte` that adds additional functionality like title, fullscreen, zoom, refresh.


## 2022-07-30

- Fixed problem with offcanvas navigation layout that caused main window to redraw (and potenatially call data endpoints) always when pinned or unpinned.

- NPM Upgrade:

```
@rollup/plugin-typescript   ^8.3.3  →   ^8.3.4     
@types/bootstrap           ^5.1.13  →   ^5.2.0     
rollup                     ^2.77.0  →  ^2.77.2     
sass                       ^1.53.0  →  ^1.54.0     
```

## 2022-07-21

```
 rollup            ^2.75.7  →  ^2.76.0     
 svelte            ^3.48.0  →  ^3.49.0     
 @types/bootstrap  ^5.1.12  →  ^5.1.13     
 bootstrap-icons    ^1.8.3  →   ^1.9.1     
 rollup            ^2.76.0  →  ^2.77.0     

 bootstrap         ^5.2.0-beta1   →  ^5.2.0
 ```

## 2022-07-06

```
 rollup                   ^2.75.6  →  ^2.75.7     
 sass                     ^1.52.3  →  ^1.53.0     
 typescript               ^4.7.3   →  ^4.7.4      
 @rollup/plugin-commonjs  ^22.0.0  →  ^22.0.1     
 svelte-check             ^2.7.2   →  ^2.8.0      
```

## 2022-06-13

- Added `responsiveSize` parameter to offcanvas compnent

- Improvement to offcanvas navigation:
    - Title button
    - Hidden gutter

- Added `use` export function to both components (offcanvas and modal):
    - Use element action function that are called when an element is created. 
    - They can return an object with a destroy method that is called after the element is unmounted.
    - Use use to get element reference and do something when element is destroyed or updated (like remove event listeners).

- Improved offcanvas navigation layout:
    - Autohide feature for offcanvas.
    - Pinning support with persisent status.

- Added support for bootstrap tooltips:
    - Tooltips are implemented in layout component.
    - To enable tooltips in project, use layout, and add standard tooltip attributes to element: `data-bs-toggle="tooltip" title="your tooltip here"`.
    - Tooltip content is reactive (refreshed automatically).

- Removed OffcanvasNav page: 
    - Offcanvas layout is now the default layout. 
    - Header navigation layout is stil present and it can be used if needed. 
    - Default layout component has import alias `./shared/layout/default` so it can be switched easily.

- Added new NPM command `fe-watch-all`: 
    - Run `npm run fe-watch-all` to simultaneously watch and incrementally build all frontend files for all pages, including SCSS stylesheet.

- NPM Upgrade:

```
 bootstrap:                 ^5.1.3   →   5.2.0-beta1
 @types/bootstrap           ^5.1.11  →  ^5.1.12     
 @rollup/plugin-typescript  ^8.3.2   →  ^8.3.3     
 bootstrap-icons            ^1.8.1   →  ^1.8.3     
 rollup                     ^2.72.1  →  ^2.75.6     
 sass                       ^1.51.0  →  ^1.52.3     
 svelte-check               ^2.7.0   →  ^2.7.2     
 typescript                 ^4.6.4   →  ^4.7.3     
 svelte-preprocess          ^4.10.6  →  ^4.10.7     
```

## 2022-05-11

- NPM Upgrade:

```
 rollup                       ^2.70.2  →  ^2.72.1     
 svelte                       ^3.47.0  →  ^3.48.0     
 typescript                   ^4.6.3  →   ^4.6.4     
 @rollup/plugin-node-resolve  ^13.2.1  →  ^13.3.0     
 @types/bootstrap             ^5.1.10  →  ^5.1.11     
```

- Added new NPM command: `dotnet-audit`. This command audits security for nuget packages with command `dotnet list package --vulnerable --include-transitive`

## 2022-04-28

- Improved modal component
- Added offcanvas component
- Added example page that uses new offcanvas navgation instead of header navigation
- Removed unneccessary error key from backend layout (for all pages execpt error page)

- NPM Upgrade:

```
 sass  ^1.50.1  →  ^1.51.0 
```

## 2022-04-24

- Exclude "tsconfig.json", "package.json" and "package-lock.json" from project files.

- Remove name from package.json

- NPM Upgrade:

```
 @rollup/plugin-commonjs  ^21.1.0  →  ^22.0.0     
```

- `Auth` converted to use standartd convention with extension methods `ConfigureAuth` and `UseAuth`


## 2022-04-23

- Moved Keys and Urls to classes in pages dir.

- Moved Auth pages to Auth Pages Area.

- NPM Upgrade:

```
 @types/bootstrap              ^5.1.9  →  ^5.1.10     
 sass                         ^1.50.0  →  ^1.50.1     
 tslib                         ^2.3.1  →   ^2.4.0     
 @rollup/plugin-commonjs      ^21.0.3  →  ^21.1.0     
 @rollup/plugin-node-resolve  ^13.2.0  →  ^13.2.1     
 @rollup/plugin-typescript     ^8.3.1  →   ^8.3.2     
 rollup                       ^2.70.1  →  ^2.70.2     
 svelte-check                  ^2.6.0  →   ^2.7.0     
 svelte-preprocess            ^4.10.5  →  ^4.10.6     
```


## 2022-04-10

Migarted back to Bootstrap with many new imporebents such as:

- Dark mode and theme switching
- Components dir and custom components such as Modal (Grid is coming soon)
- Bootstrap icons
- etc

[Full Changelog](https://github.com/vb-consulting/RazorSvelte/compare/master...carbon)

## 2022-04-07

- Remove unused props in `Index.entry.ts`

- NPM Upgrade:

```
 carbon-icons-svelte  ^10.45.1  →  ^11.0.1     
 sass                  ^1.49.9  →  ^1.50.0     
 svelte                ^3.46.4  →  ^3.46.6     
 svelte-preprocess     ^4.10.4  →  ^4.10.5     
```

Use snake case naming in all svelte and ts files (App dir).

## 2022-03-29

- Change all file name capitalization in App dir to lower pascal case. 

## 2022-03-28

```
 @rollup/plugin-commonjs    ^21.0.2  →   ^21.0.3     
 carbon-components         ^10.55.2  →  ^10.56.0     
 carbon-components-svelte   ^0.62.2  →   ^0.62.3     
 typescript                  ^4.6.2  →    ^4.6.3     
```

## 2022-03-24

- Refactor all pages to use SMUI [Carbon Components Svelte](https://carbon-components-svelte.onrender.com/).


## 2022-03-16

- NPM Upgrade

```
 @rollup/plugin-commonjs           ^21.0.1  →         ^21.0.2     
 @rollup/plugin-replace             ^3.1.0  →          ^4.0.0     
 @rollup/plugin-typescript          ^8.3.0  →          ^8.3.1     
 svelte-material-ui         ^6.0.0-beta.14  →  ^6.0.0-beta.15     
 smui-theme                 ^6.0.0-beta.14  →  ^6.0.0-beta.15     
 rollup                            ^2.67.2  →         ^2.70.1     
 sass                              ^1.49.7  →         ^1.49.9     
 svelte-check                       ^2.4.3  →          ^2.4.6     
 svelte-preprocess                 ^4.10.3  →         ^4.10.4     
 typescript                         ^4.5.5  →          ^4.6.2     
 ```
## 2022-02-16

- Refactor all pages to use SMUI (Svetle Material UI).

- Enforce uppercase for first letter naming convention for Svelte modules.

- Configured light and dark theme and added frontend-theme-compile commands npm (for light, dark and all)

- Added SMUI (Svetle Material UI) packages

- Removed package "bootstrap": "^5.1.3",

- Added packeges

    "svelte-material-ui": "^6.0.0-beta.14",
    "smui-theme": "^6.0.0-beta.14",

- Moved the entire codebase to bootstrap branch.

- Separated changelog.md from the main readme file.

- NPM Upgrade

```
 @rollup/plugin-node-resolve  ^13.1.2  →  ^13.1.3
 @rollup/plugin-replace        ^3.0.1  →   ^3.1.0
 rollup                       ^2.62.0  →  ^2.67.2
 sass                         ^1.45.2  →  ^1.49.7
 svelte                       ^3.44.3  →  ^3.46.4
 svelte-check                 ^2.2.11  →   ^2.4.3
 svelte-preprocess            ^4.10.1  →  ^4.10.3
 typescript                    ^4.5.4  →   ^4.5.5
```

## 2022-01-02

### NPM Upgrade:

```
@rollup/plugin-commonjs  ^21.0.0  →  ^21.0.1
@rollup/plugin-node-resolve  ^13.0.6  →  ^13.1.2
@rollup/plugin-replace  ^3.0.0  →  ^3.0.1
@tsconfig/svelte  ^2.0.1  →  ^3.0.0
rollup  ^2.58.0  →  ^2.62.0
sass  ^1.43.2  →  ^1.45.2
svelte  ^3.44.0  →  ^3.44.3
svelte-check  ^2.2.7  →  ^2.2.11
svelte-preprocess  ^4.9.8  →  ^4.10.1
typescript  ^4.4.  →  ^4.5.4
```

### node-sass removed completely

Previously there were two sass preprocessor packages:
- `node-sass` used for building main (shared) css file
- `sass` used in rollup configuration to parse scoped scss module content

`node-sass` is removed in favor of the `sass` package. All scss processing is doene by the `sass` command.

All frontend build tools are tested and working with latest stable NodeJS version (v17.3.0)

## 2021-10-19

### NPM Upgrade

```
 @rollup/plugin-node-resolve  ^13.0.5  →  ^13.0.6
 @rollup/plugin-typescript     ^8.2.5  →   ^8.3.0
 bootstrap                     ^5.1.2  →   ^5.1.3
 sass                         ^1.42.1  →  ^1.43.2
 svelte                       ^3.43.1  →  ^3.44.0
 svelte-check                  ^2.2.6  →   ^2.2.7
 typescript                    ^4.4.3  →   ^4.4.4
```

### MapFallback skips api segment

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

## 2021-10-06

### NPM Upgrade

```
 bootstrap                ^5.1.1  →  ^5.1.2
```

### Request Localization Support

Two new configuration keys:

```
  "EnableBrowserRequestLocalization": true,
  "DefaultCulture": "en-US",
```

If `EnableBrowserRequestLocalization` is enabled, every server-side request thread will have culture set match default culture from your browser. Chromium brosers: Settings -> Languages -> Language.

Value is represented as `Accept-Language` request header and [lambda routine](https://github.com/vb-consulting/RazorSvelte/blob/master/RazorSvelte/Program.cs#L63)  will always take the first value from comma separated string.

If culture is not supported or `Accept-Language` not present, `DefaultCulture` will be used as fallback.

This can be used to implement localization to your application (perhaps from the database or cookie).

## 2021-10-02

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


### Added support for the localization:

Two new configration keys:

- `"EnableBrowserRequestLocalization": true,`
- `"DefualtCulture": "en-US",`

If the `EnableBrowserRequestLocalization` is enabled then server-side request threads will be set to use the same culture as designated by your browser (Chromium browsers: Settings -> Languagues -> Languague).

Each request will run custom request culture provider routine that will set the request thread from the first entry (comma sperated) - in the `Accept-Language` request header (that is basically set in your browser options).

If selected culture is missing or not supported, than `DefualtCulture` fallback will be used.

This can be further customized to support localization that will use user selection (from database, cookie, etc).

### NPM Upgrade:
```
bootstrap  ^5.1.1  →  ^5.1.2     
```

## 2021-09-27

- Added `dotnet-watch` command that runs `dotnet watch`. `dotnet watch` in .NET6 in combination with Rollup watch is amazing, you see changes immidiatly when you save the file.

- Changed naming convention of Svelte components to pascal casing ("PascalCasing"), because that seems to be default convention for all Svelte components.
