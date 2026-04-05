using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Web.Services;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddWebServices(this IHostApplicationBuilder builder)
    {
        builder.Services.AddDatabaseDeveloperPageExceptionFilter();

        builder.Services.AddScoped<IUser, CurrentUser>();

        builder.Services.AddHttpContextAccessor();

        builder.Services.AddExceptionHandler<ProblemDetailsExceptionHandler>();

        // Customise default API behaviour
        builder.Services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true
        );

        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddOpenApi(options =>
        {
            options.AddOperationTransformer<ApiExceptionOperationTransformer>();
            options.AddOperationTransformer<IdentityApiOperationTransformer>();
        });
    }

    public static void AddKeyVaultIfConfigured(this IHostApplicationBuilder builder)
    {
        var keyVaultUri = builder.Configuration["AZURE_KEY_VAULT_ENDPOINT"];
        if (!string.IsNullOrWhiteSpace(keyVaultUri))
        {
            var failFast =
                builder.Configuration.GetValue<bool?>("AZURE_KEY_VAULT_FAIL_FAST") ?? false;

            try
            {
                builder.Configuration.AddAzureKeyVault(
                    new Uri(keyVaultUri),
                    new DefaultAzureCredential()
                );
            }
            catch (Exception ex)
            {
                if (failFast)
                {
                    throw;
                }

                Console.Error.WriteLine(
                    $"Key Vault configuration load failed for '{keyVaultUri}'. Continuing startup with existing configuration. Error: {ex.Message}"
                );
            }
        }

        ResolveAkvConnectionStringIfNeeded(builder);
    }

    private static void ResolveAkvConnectionStringIfNeeded(IHostApplicationBuilder builder)
    {
        const string connectionStringKey = "ConnectionStrings:WalrhouseDb";
        var connectionStringValue = builder.Configuration[connectionStringKey];
        if (string.IsNullOrWhiteSpace(connectionStringValue))
        {
            return;
        }

        if (!TryParseAkvReference(connectionStringValue, out var vaultName, out var secretName))
        {
            return;
        }

        var configuredVaultEndpoint = builder.Configuration["AZURE_KEY_VAULT_ENDPOINT"];
        var vaultUri = !string.IsNullOrWhiteSpace(configuredVaultEndpoint)
            ? new Uri(configuredVaultEndpoint)
            : new Uri($"https://{vaultName}.vault.azure.net/");

        try
        {
            var client = new SecretClient(vaultUri, new DefaultAzureCredential());
            var secret = client.GetSecret(secretName);
            builder.Configuration[connectionStringKey] = secret.Value.Value;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(
                $"Failed to resolve Key Vault connection string reference '{connectionStringValue}'. Error: {ex.Message}"
            );
        }
    }

    private static bool TryParseAkvReference(
        string value,
        out string vaultName,
        out string secretName
    )
    {
        vaultName = string.Empty;
        secretName = string.Empty;

        if (!value.StartsWith("akvs://", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var parts = value["akvs://".Length..].Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 3)
        {
            return false;
        }

        vaultName = parts[1];
        secretName = parts[2];
        return true;
    }
}
