namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a barcode associated with an item.
/// Items can have multiple barcodes for different units of measure or packaging types.
/// </summary>
public class ItemBarcode : BaseEntity
{
    /// <summary>
    /// Gets or sets the item code this barcode belongs to.
    /// Foreign key to the Item entity.
    /// </summary>
    public required string ItemCode { get; set; }

    /// <summary>
    /// Gets or sets the navigation property to the parent Item.
    /// </summary>
    public Item Item { get; set; } = null!;

    /// <summary>
    /// Gets or sets the barcode value.
    /// </summary>
    public required string Value { get; set; }

    /// <summary>
    /// Gets or sets the barcode type/format (e.g., UPC, EAN13, Code128, QR).
    /// </summary>
    public string? Format { get; set; }
}
