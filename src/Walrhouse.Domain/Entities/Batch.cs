namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a batch of items.
/// This is primarily used to track the expiration dates of items
/// organized by batch.
/// </summary>
public class Batch : BaseAuditableEntity
{
    /// <summary>
    /// This is a helper method to normalize the ExpiryDate to UTC midnight.
    /// This is to ensure that we are only comparing the date part of the ExpiryDate
    /// when we are checking for expired batches, and not the time part.
    /// </summary>
    /// <param name="date"></param>
    /// <returns></returns>
    private static DateTimeOffset NormalizeToUtcMidnight(DateTimeOffset date)
    {
        return new DateTimeOffset(date.UtcDateTime.Date, TimeSpan.Zero);
    }

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

    private DateTimeOffset _expiryDate;

    /// <summary>
    /// This represents the Expiration Date of this
    /// batch of item, measured in UTC.
    /// Note: Any time component of ExpiryDate is normalized to UTC midnight.
    /// </summary>
    public required DateTimeOffset ExpiryDate
    {
        get => _expiryDate;
        set => _expiryDate = NormalizeToUtcMidnight(value);
    }

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
