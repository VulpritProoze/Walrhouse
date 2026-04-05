using Aspire.Hosting.DevTunnels;
using Walrhouse.Shared;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("aca-env");

var dbParam = builder.AddParameter(Services.Database, secret: true);
var adminPassword = builder.AddParameter(Services.SeedAdminPassword, secret: true);
var cookieExpiryDays = builder.AddParameter(Services.CookieExpiryDays);
var adminEmail = builder.AddParameter(Services.SeedAdminEmail);
var adminFirstName = builder.AddParameter(Services.SeedAdminFirstName);
var adminLastName = builder.AddParameter(Services.SeedAdminLastName);
var azureKeyVaultEndpoint = builder.AddParameter(Services.AzureKeyVaultEndpoint);

var web = builder
    .AddProject<Projects.Walrhouse_Web>(Services.WebApi)
    .WithEnvironment(Services.DatabaseConnectionString, dbParam)
    .WithEnvironment(Services.SeedAdminPassword, adminPassword)
    .WithEnvironment(Services.SeedAdminEmail, adminEmail)
    .WithEnvironment(Services.SeedAdminFirstName, adminFirstName)
    .WithEnvironment(Services.SeedAdminLastName, adminLastName)
    .WithEnvironment(Services.CookieExpiryDays, cookieExpiryDays)
    .WithEnvironment(Services.AzureKeyVaultEndpoint, azureKeyVaultEndpoint)
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
