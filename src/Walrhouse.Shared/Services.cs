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
}
