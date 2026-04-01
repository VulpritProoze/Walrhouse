namespace Walrhouse.Domain.Constants;

public abstract class Roles
{
    public const string Administrator = nameof(Administrator);
    public const string WarehouseAdministrator = nameof(WarehouseAdministrator);
    public const string InventoryController = nameof(InventoryController);
    public const string InventoryClerk = nameof(InventoryClerk);

    public static readonly string[] All = new[]
    {
        Administrator,
        WarehouseAdministrator,
        InventoryController,
        InventoryClerk,
    };
}
