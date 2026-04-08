namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a transactional history of barcode generations.
/// This is primarily used as an audit log for barcodes.
/// </summary>
public class BarcodeHistory : BaseEntity
{
    /// <summary>
    /// Gets or sets the barcode value.
    /// </summary>
    public required string BarcodeValue { get; set; }

    /// <summary>
    /// Gets or sets the barcode format.
    /// </summary>
    public BarcodeFormat? BarcodeFormat { get; set; }

    /// <summary>
    /// Gets or sets the remarks.
    /// </summary>
    public string? Remarks { get; set; }

    /// <summary>
    /// Gets or sets when the entity was created.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the creator.
    /// </summary>
    public string? CreatedBy { get; set; }

    /// <summary>
    /// Gets or sets when the entity was last modified.
    /// </summary>
    public DateTimeOffset LastModifiedAt { get; set; }

    /// <summary>
    /// Gets or sets the identifier of the last modifier.
    /// </summary>
    public string? LastModifiedBy { get; set; }
}
