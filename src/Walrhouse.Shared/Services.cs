namespace Walrhouse.Shared;

public static class Services
{
    /// <summary>
    /// The name of the WebClient service.
    /// This service is responsible for hosting the frontend application.
    /// </summary>
    public const string WebClient = "walrhouse-webclient";

    /// <summary>
    /// The name of the WebApi service.
    /// This service is responsible for hosting the Web API application.
    /// </summary>
    public const string WebApi = "walrhouse-webapi";

    /// <summary>
    /// The name of the DevTunnel service.
    /// This service is responsible for hosting the DevTunnel.
    /// </summary>
    public const string DevTunnel = "walrhouse-devtunnel";

    /// <summary>
    /// The name of the Database Server service.
    /// This service is responsible for hosting the database server.
    /// </summary>
    public const string DatabaseServer = "WalrhouseDbServer";

    /// <summary>
    /// The name of the Database service.
    /// This service is responsible for hosting the database.
    /// </summary>
    public const string Database = "WalrhouseDb";

    /// <summary>
    /// The name of the Database Connection String parameter.
    /// This parameter is used to store the database connection string.
    /// </summary>
    public const string DatabaseConnectionString = "ConnectionStrings__WalrhouseDb";

    /// <summary>
    /// The environment variable name for cookie expiry days.
    /// </summary>
    public const string CookieExpiryDays = "CookieExpiryDays";

    /// <summary>
    /// The AppHost parameter name for cookie expiry days.
    /// </summary>
    public const string CookieExpiryDaysParameter = "CookieExpiryDays";

    /// <summary>
    /// The environment variable name for the administrator email.
    /// </summary>
    public const string SeedAdminEmail = "SeedUsers__Administrator__Email";

    /// <summary>
    /// The AppHost parameter name for the administrator email.
    /// </summary>
    public const string SeedAdminEmailParameter = "SeedAdminEmail";

    /// <summary>
    /// The environment variable name for the administrator first name.
    /// </summary>
    public const string SeedAdminFirstName = "SeedUsers__Administrator__FirstName";

    /// <summary>
    /// The AppHost parameter name for the administrator first name.
    /// </summary>
    public const string SeedAdminFirstNameParameter = "SeedAdminFirstName";

    /// <summary>
    /// The environment variable name for the administrator last name.
    /// </summary>
    public const string SeedAdminLastName = "SeedUsers__Administrator__LastName";

    /// <summary>
    /// The AppHost parameter name for the administrator last name.
    /// </summary>
    public const string SeedAdminLastNameParameter = "SeedAdminLastName";

    /// <summary>
    /// The environment variable name for the administrator password.
    /// </summary>
    public const string SeedAdminPassword = "SeedUsers__Administrator__Password";

    /// <summary>
    /// The AppHost parameter name for the administrator password.
    /// </summary>
    public const string SeedAdminPasswordParameter = "SeedAdminPassword";

    /// <summary>
    /// The environment variable name for the Azure Key Vault endpoint.
    /// </summary>
    public const string AzureKeyVaultEndpoint = "AZURE_KEY_VAULT_ENDPOINT";

    /// <summary>
    /// The AppHost parameter name for the Azure Key Vault endpoint.
    /// </summary>
    public const string AzureKeyVaultEndpointParameter = "AzureKeyVaultEndpoint";

    /// <summary>
    /// The environment variable name for selecting a user-assigned managed identity.
    /// </summary>
    public const string AzureClientId = "AZURE_CLIENT_ID";

    /// <summary>
    /// The AppHost parameter name for the managed identity client id.
    /// </summary>
    public const string AzureClientIdParameter = "AzureClientId";
}
