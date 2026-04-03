namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a batch of items.
/// This is primarily used to track the expiration dates of items
/// organized by batch.
/// </summary>
public class Batch : BaseAuditableEntity
{
    /// <summary>
    /// The unique identifier of a batch.
    /// </summary>
    public required string BatchNumber { get; set; }

    /// <summary>
    /// Gets or sets the ItemCode.
    /// Foreign key to Item entity.
    /// </summary>
    public required string ItemCode { get; set; }

    /// <summary>
    /// This represents the navigation property to Item entity.
    /// </summary>
    public required Item Item { get; set; }

    /// <summary>
    /// This represents the Expiration Date of this
    /// batch of item, measured in UTC.
    /// </summary>
    public required string ExpiryDate { get; set; }

    /// <summary>
    /// This represents the status of the item.
    /// </summary>
    public required BatchStatus Status { get; set; }

    /// <summary>
    /// Foreign key to Bin entity.
    /// </summary>
    public required string BinNo { get; set; }

    /// <summary>
    /// Navigation props to Bin entity.
    /// </summary>
    public required Bin Bin { get; set; }
}
