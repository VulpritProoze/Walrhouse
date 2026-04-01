namespace Walrhouse.Domain.Entities;

/// <summary>
/// A partial class for barcode methods related to Item entity.
/// </summary>
public partial class Item
{
    /// <summary>
    /// Adds a barcode to the item's barcode collection.
    /// Validates that duplicate barcodes are not added and ensures only one primary barcode exists.
    /// </summary>
    /// <param name="barcode">The barcode to add to the collection</param>
    /// <exception cref="Exception">Thrown when a primary barcode already exists or the barcode is a duplicate</exception>
    public void AddBarcode(ItemBarcode barcode)
    {
        if (barcode.IsPrimary && _itemBarcodes.Any(b => b.IsPrimary))
            throw new Exception("This item already has a primary barcode.");

        if (_itemBarcodes.Any(b => b.Barcode == barcode.Barcode))
            throw new Exception("This barcode already exists.");

        _itemBarcodes.Add(
            new ItemBarcode
            {
                ItemCode = barcode.ItemCode,
                Barcode = barcode.Barcode,
                BarcodeType = barcode.BarcodeType,
                UnitOfMeasure = barcode.UnitOfMeasure,
                IsPrimary = barcode.IsPrimary,
            }
        );

        if (barcode.IsPrimary)
        {
            Barcode = barcode.Barcode;
        }
    }

    /// <summary>
    /// Changes the primary barcode to an existing barcode from the collection.
    /// </summary>
    /// <param name="itemBarcode">The barcode to set as primary (must exist in collection)</param>
    public void ChangePrimaryBarcode(ItemBarcode itemBarcode)
    {
        var existingInCollection = _itemBarcodes.FirstOrDefault(b =>
            b.Barcode == itemBarcode.Barcode
        );

        if (existingInCollection == null)
            throw new Exception(
                $"Barcode '{itemBarcode.Barcode}' not found in collection for this item."
            );

        // Remove primary flag from current primary
        var oldPrimary = _itemBarcodes.FirstOrDefault(b => b.IsPrimary);
        if (oldPrimary != null)
            oldPrimary.IsPrimary = false;

        // Set new primary
        existingInCollection.IsPrimary = true;
        Barcode = existingInCollection.Barcode;
    }

    /// <summary>
    /// Creates a new barcode and sets it as the primary barcode.
    /// Automatically adds the barcode to the collection.
    /// </summary>
    /// <param name="barcodeValue">The barcode string value</param>
    /// <param name="barcodeType">Optional barcode type (e.g., UPC, EAN13, Code128)</param>
    /// <param name="unitOfMeasure">Optional unit of measure (e.g., Piece, Box, Pallet)</param>
    public void ChangePrimaryBarcode(
        string barcodeValue,
        string? barcodeType = null,
        string? unitOfMeasure = null
    )
    {
        if (string.IsNullOrWhiteSpace(barcodeValue))
            throw new Exception("Barcode value cannot be empty.");

        // Check if barcode already exists
        if (_itemBarcodes.Any(b => b.Barcode == barcodeValue))
            throw new Exception($"Barcode '{barcodeValue}' already exists for this item.");

        // Remove primary flag from current primary
        var oldPrimary = _itemBarcodes.FirstOrDefault(b => b.IsPrimary);
        if (oldPrimary != null)
            oldPrimary.IsPrimary = false;

        // Create and add new primary barcode
        var newPrimaryBarcode = new ItemBarcode
        {
            ItemCode = ItemCode,
            Barcode = barcodeValue,
            BarcodeType = barcodeType,
            UnitOfMeasure = unitOfMeasure,
            IsPrimary = true,
        };

        _itemBarcodes.Add(newPrimaryBarcode);
        Barcode = barcodeValue;
    }
}
