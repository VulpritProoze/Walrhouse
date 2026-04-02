namespace Walrhouse.Domain.Entities;

/// <summary>
/// This entity represents the various bin locations scattered
/// throughout the warehouse.
/// </summary>
public class Bin : BaseEntity
{
    /// <summary>
    /// Unique identifier of the bin / shelf
    /// </summary>
    public required string BinNo { get; set; }

    /// <summary>
    /// Name of the bin.
    /// </summary>
    public required string BinName { get; set; }

    /// <summary>
    /// Represents the unique identifier of the related warehouse.
    /// This is the foreign key of Bin to Warehouse.
    /// </summary>
    public required string WarehouseCode { get; set; }

    /// <summary>
    /// Navigation property to Warehouse.
    /// </summary>
    public required Warehouse Warehouse { get; set; }
}
