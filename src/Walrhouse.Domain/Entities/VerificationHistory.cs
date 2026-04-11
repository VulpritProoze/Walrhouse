namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a history of barcode verifications.
/// </summary>
public class VerificationHistory : BaseEntity
{
    /// <summary>
    /// Gets or sets the batch number that was verified.
    /// </summary>
    public required string BatchNumberVerified { get; set; }

    /// <summary>
    /// Gets or sets the navigation property to Batch entity.
    /// </summary>
    public required Batch Batch { get; set; }

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
}
