using Walrhouse.Domain.Events.Items;

namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents an inventory item in the warehouse management system.
/// Supports multiple barcodes, different unit of measures, and audit tracking.
/// </summary>
public partial class Item : BaseAuditableEntity
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

    private bool _isScanned = false;

    /// <summary>
    /// Gets or sets a value indicating whether the item has been scanned.
    /// This is typically used in warehouse operations for tracking scan status.
    /// Raises an <see cref="ItemScannedEvent"/> when set to true.
    /// </summary>
    public bool IsScanned
    {
        get => _isScanned;
        set
        {
            // Raise domain event when item is scanned (false -> true)
            if (value && !_isScanned)
            {
                AddDomainEvent(new ItemScannedEvent(this));
            }

            _isScanned = value;
        }
    }

    private string? _barcode;

    /// <summary>
    /// Gets the primary barcode for the item.
    /// This is synchronized with the primary barcode in the ItemBarcodes collection.
    /// Use <see cref="ChangePrimaryBarcode(string, string?, string?)"/> to modify.
    /// </summary>
    public string? Barcode
    {
        get => _barcode;
        private set => _barcode = value;
    }

    /// <summary>
    /// Gets or sets optional remarks or notes about the item.
    /// </summary>
    public string? Remarks { get; set; }

    /// <summary>
    /// Gets or sets the item group classification.
    /// Used for categorizing items (e.g., General, Electronics, Raw Materials).
    /// </summary>
    public ItemGroup? ItemGroup { get; set; }

    private readonly List<ItemBarcode> _itemBarcodes = new();

    /// <summary>
    /// Gets the read-only collection of barcodes associated with this item.
    /// Items can have multiple barcodes for different units of measure or packaging types.
    /// Use <see cref="AddBarcode"/> method to add new barcodes.
    /// </summary>
    public IReadOnlyCollection<ItemBarcode> ItemBarcodes => _itemBarcodes.AsReadOnly();
}
