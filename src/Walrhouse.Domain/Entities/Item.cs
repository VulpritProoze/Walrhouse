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
    public ItemGroup? ItemGroup { get; set; } = Enums.ItemGroup.General;

    /// <summary>
    /// Gets or sets the unique identifier of the UoM group associated
    /// with this item.
    /// This is a foreign key to the UoMGroup entity, which defines the various
    /// units of measurement and their conversion factors for this item.
    /// </summary>
    public required string UgpEntry { get; set; }

    /// <summary>
    /// Gets or sets the navigation property to the UoMGroup entity.
    ///
    /// </summary>
    public required UoMGroup UoMGroup { get; set; }

    /// <summary>
    /// Gets or sets the barcode value associated with this item.
    /// This is used for scanning and identification purposes in the warehouse.
    /// </summary>
    public required string BarcodeValue { get; set; }

    /// <summary>
    /// Gets or sets the barcode format/type (e.g., UPC, EAN13, Code128, QR).
    /// </summary>
    public BarcodeFormat? BarcodeFormat { get; set; }
}
