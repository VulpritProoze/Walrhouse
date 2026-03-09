namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a barcode associated with an item.
/// Items can have multiple barcodes for different units of measure or packaging types.
/// </summary>
public class ItemBarcode : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique identifier for the item barcode.
    /// </summary>
    public int ItemBarcodeId { get; set; }

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
    public required string Barcode { get; set; }

    /// <summary>
    /// Gets or sets the barcode type/format (e.g., UPC, EAN13, Code128, QR).
    /// </summary>
    public string? BarcodeType { get; set; }

    /// <summary>
    /// Gets or sets the unit of measure this barcode represents (e.g., "Box", "Piece", "Case", "Pallet").
    /// </summary>
    public string? UnitOfMeasure { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this is the primary/default barcode for the item.
    /// Only one barcode per item should be marked as primary.
    /// </summary>
    public bool IsPrimary { get; set; } = false;
}
