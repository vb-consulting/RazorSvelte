using RazorSvelte;

if (RazorSvelte.Scripts.UrlBuilder.Build(args))
{
    return;
}

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

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(Urls.ErrorUrl);
    app.UseHsts();
}

//
// Configure the HTTP request pipeline.
//
{
    app.UseApp();
    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseAuthorization();
    app.MapRazorPages();

    app.Run();
}
