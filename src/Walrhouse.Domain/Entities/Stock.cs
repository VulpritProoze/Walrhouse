namespace Walrhouse.Domain.Entities;

/// <summary>
/// This entity represents the overall tracking of stock
/// of an item.
/// </summary>
public class Stock : BaseEntity
{
    /// <summary>
    /// Foreign key to Item entity.
    /// </summary>
    public required string ItemCode { get; set; }

    /// <summary>
    /// Navigation props to Item entity.
    /// </summary>
    public required Item Item { get; set; }

    /// <summary>
    /// Foreign key to Bin entity.
    /// </summary>
    public required string BinId { get; set; }

    /// <summary>
    /// Navigation props to Bin entity.
    /// </summary>
    public required Bin Bin { get; set; }

    /// <summary>
    /// Represents the numerical quantity of
    /// current stock on hand of an item.
    /// </summary>
    public int QuantityOnHand { get; set; } = 0;
}
