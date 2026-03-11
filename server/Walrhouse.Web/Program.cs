using Scalar.AspNetCore;
using Walrhouse.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.AddApplicationServices();
builder.AddInfrastructureServices();
builder.AddWebServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    await app.InitializeDatabaseAsync();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors(static builder => builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());

app.MapOpenApi();
app.MapScalarApiReference();

app.UseExceptionHandler(options => { });

app.Map("/", () => Results.Redirect("/scalar"));

// app.MapDefaultEndpoints();
app.MapEndpoints();

app.Run();
