internal static class AspireExtensions
{
    public static IResourceBuilder<T> WithAspNetCoreEnvironment<T>(this IResourceBuilder<T> builder)
        where T : IResourceWithEnvironment
    {
        builder.WithEnvironment(context =>
        {
            var commandLineArgs = Environment.GetCommandLineArgs();
            var isManifestPublish = commandLineArgs.Any(arg =>
                string.Equals(arg, "manifest", StringComparison.OrdinalIgnoreCase)
            );
            if (isManifestPublish)
            {
                context.EnvironmentVariables["ASPNETCORE_ENVIRONMENT"] = "Production";
                return;
            }

            var explicitAspNetCoreEnvironment = Environment.GetEnvironmentVariable(
                "ASPNETCORE_ENVIRONMENT"
            );
            if (!string.IsNullOrWhiteSpace(explicitAspNetCoreEnvironment))
            {
                context.EnvironmentVariables["ASPNETCORE_ENVIRONMENT"] =
                    explicitAspNetCoreEnvironment;
                return;
            }

            var explicitDotNetEnvironment = Environment.GetEnvironmentVariable(
                "DOTNET_ENVIRONMENT"
            );
            if (!string.IsNullOrWhiteSpace(explicitDotNetEnvironment))
            {
                context.EnvironmentVariables["ASPNETCORE_ENVIRONMENT"] = explicitDotNetEnvironment;
                return;
            }

            var isAzdDeployment = !string.IsNullOrWhiteSpace(
                Environment.GetEnvironmentVariable("AZURE_ENV_NAME")
            );
            context.EnvironmentVariables["ASPNETCORE_ENVIRONMENT"] = isAzdDeployment
                ? "Production"
                : "Development";
        });

        return builder;
    }
}
