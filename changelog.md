# Changes

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