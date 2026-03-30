using Aspire.Hosting.DevTunnels;
using Walrhouse.Shared;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("aca-env");

var dbParam = builder.AddParameter(Services.Database, secret: true);

var web = builder
    .AddProject<Projects.Walrhouse_Web>(Services.WebApi)
    .WithEnvironment(Services.DatabaseConnectionString, dbParam)
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
    var client = builder
        .AddJavaScriptApp(Services.WebClient, "./../Walrhouse.Web/App/WebClient")
        .WithRunScript("dev")
        .WithReference(web)
        .WaitFor(web)
        .WithHttpEndpoint(env: "PORT")
        .WithExternalHttpEndpoints();

    builder.AddDevTunnel(Services.DevTunnel).WithReference(client);
}

builder.Build().Run();
