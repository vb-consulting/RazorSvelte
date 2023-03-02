global using Microsoft.AspNetCore.Mvc.RazorPages;
global using System;
global using System.Linq;
global using System.Text.Json;
global using Microsoft.Extensions.Options;
global using RazorSvelte.Auth;
global using RazorSvelte.Pages;

using RazorSvelte;

#if DEBUG
if (RazorSvelte.Scripts.Scripts.BuildModels(args))
{
    return;
}
if (RazorSvelte.Scripts.Scripts.BuildUrls(args))
{
    return;
}
#endif

var builder = WebApplication.CreateBuilder(args);

//
// Add services to the container.
//
{
    builder.Services.AddRazorPages();
    builder.Services.AddHttpClient().AddOptions();
    builder.ConfigureApp();
}

var app = builder.Build();

//
// Configure the HTTP request pipeline.
//
{
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler(Urls.ErrorUrl);
        app.UseHsts();
    }

    app.UseApp();
    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseAuthorization();
    app.MapRazorPages();

    app.Run();
}
