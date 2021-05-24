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

The end result is an **extremely optimized web application** where the backend is rendered and served by .NET and the frontend is optimized by Svelte and Rollup.
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
