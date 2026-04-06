using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace Microsoft.Extensions.DependencyInjection
{
    /// <summary>
    /// Helpers to resolve configuration values that reference Azure Key Vault using the "akvs://" scheme.
    /// </summary>
    public static class KeyVaultExtensions
    {
        /// <summary>
        /// Scans the application's configuration and replaces any values that start with
        /// "akvs://" with the secret value fetched from the referenced Key Vault.
        /// </summary>
        /// <param name="builder">The host application builder whose configuration will be updated.</param>
        public static void ResolveAkvsReferences(this IHostApplicationBuilder builder)
        {
            if (builder == null)
                throw new ArgumentNullException(nameof(builder));

            var config = builder.Configuration;
            var entries = config
                .AsEnumerable()
                .Where(kv => !string.IsNullOrEmpty(kv.Value))
                .ToList();

            var toUpdate = new List<(string Key, string Value)>();

            foreach (var kv in entries)
            {
                var value = kv.Value?.Trim();
                if (string.IsNullOrEmpty(value))
                    continue;

                if (!value.StartsWith("akvs://", StringComparison.OrdinalIgnoreCase))
                    continue;

                if (!TryParseAkvsReference(value, out var vaultName, out var secretName))
                    continue;

                // Build vault URI - allow overriding endpoint via AZURE_KEY_VAULT_ENDPOINT
                var configuredVaultEndpoint = config["AZURE_KEY_VAULT_ENDPOINT"];
                var vaultUri = !string.IsNullOrWhiteSpace(configuredVaultEndpoint)
                    ? new Uri(configuredVaultEndpoint)
                    : new Uri($"https://{vaultName}.vault.azure.net/");

                try
                {
                    var client = new SecretClient(vaultUri, new DefaultAzureCredential());
                    var secret = client.GetSecret(secretName);
                    toUpdate.Add((kv.Key, secret.Value.Value));
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine(
                        $"Failed to resolve Key Vault reference '{value}' for configuration key '{kv.Key}'. Error: {ex.Message}"
                    );
                }
            }

            // Apply updates after enumeration
            foreach (var upd in toUpdate)
            {
                config[upd.Key] = upd.Value;
            }
        }

        private static bool TryParseAkvsReference(
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
            // Expected: akvs://{subscription?}/{vaultName}/{secretName}
            if (parts.Length < 2)
            {
                return false;
            }

            // If the reference includes a leading subscription id, vaultName will be parts[1]
            // If subscription is omitted, vaultName will be parts[0]. Handle both.
            if (parts.Length >= 3)
            {
                vaultName = parts[1];
                secretName = parts[2];
            }
            else
            {
                vaultName = parts[0];
                secretName = parts[1];
            }

            return !string.IsNullOrWhiteSpace(vaultName) && !string.IsNullOrWhiteSpace(secretName);
        }
    }
}
