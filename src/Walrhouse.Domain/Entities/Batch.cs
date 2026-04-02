namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a batch of items.
/// </summary>
public class Batch : BaseAuditableEntity
{
    public required string BatchNumber { get; set; }

    public required string ItemCode { get; set; }
    public required Item Item { get; set; }
}
