using Walrhouse.Shared;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("aca-env");

// IResourceBuilder<IResourceWithConnectionString> database;

// if (builder.ExecutionContext.IsPublishMode)
// {
//     database = builder
//         .AddPostgres(Services.DatabaseServer)
//         .WithDataVolume()
//         .AddDatabase(Services.Database);
// }
// else
// {
//     database = builder.AddConnectionString(Services.Database);
// }

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
    builder
        .AddJavaScriptApp(Services.WebClient, "./../Walrhouse.Web/App/WebClient")
        .WithRunScript("dev")
        .WithReference(web)
        .WaitFor(web)
        .WithHttpEndpoint(env: "PORT")
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
