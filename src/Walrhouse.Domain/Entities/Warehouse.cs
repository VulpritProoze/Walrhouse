namespace Walrhouse.Domain.Entities;

/// <summary>
/// This entity represents the warehouse/s.
/// </summary>
public class Warehouse : BaseAuditableEntity
{
    /// <summary>
    /// This represents the unique identifier of the warehouse.
    /// </summary>
    public required string WarehouseCode { get; set; }

    /// <summary>
    /// This represents the name of the warehouse.
    /// </summary>
    public string? WarehouseName { get; set; }
}
