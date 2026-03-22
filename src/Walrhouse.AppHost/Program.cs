using Microsoft.Extensions.Hosting;
using Walrhouse.Shared;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("aca-env");

var database = builder.AddConnectionString(Services.Database);

var web = builder
    .AddProject<Projects.Walrhouse_Web>(Services.WebApi)
    .WithReference(database)
    .WaitFor(database)
    .WithExternalHttpEndpoints()
    .WithAspNetCoreEnvironment()
    .WithUrlForEndpoint(
        "http",
        url =>
        {
            url.DisplayText = "Scalar API Reference";
            url.Url = "/scalar";
        }
    );

if (builder.ExecutionContext.IsRunMode)
{
    builder
        .AddJavaScriptApp(Services.WebClient, "./../Walrhouse.Web/App/WebClient")
        .WithRunScript("dev")
        .WithReference(web)
        .WaitFor(web)
        .WithHttpEndpoint(env: "PORT")
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
