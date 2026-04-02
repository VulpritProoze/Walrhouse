namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents an inventory item in the warehouse management system.
/// </summary>
public class Item : BaseAuditableEntity
{
    /// <summary>
    /// Gets or sets the unique item code.
    /// This is typically used as the business key for the item.
    /// </summary>
    public required string ItemCode { get; set; }

    /// <summary>
    /// Gets or sets the display name of the item.
    /// </summary>
    public required string ItemName { get; set; }

    /// <summary>
    /// Gets or sets optional remarks or notes about the item.
    /// </summary>
    public string? Remarks { get; set; }

    /// <summary>
    /// Gets or sets the item group classification.
    /// Used for categorizing items (e.g., General, Medicines, etc.)
    /// </summary>
    public ItemGroup ItemGroup { get; set; } = ItemGroup.General;

    public required string UgpEntry { get; set; }

    public required UoMGroup UoMGroup { get; set; }
}
