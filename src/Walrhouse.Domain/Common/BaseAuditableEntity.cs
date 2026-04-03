namespace Walrhouse.Domain.Common;

/// <summary>
/// Base entity type that includes audit metadata for creation and modification.
/// </summary>
public abstract class BaseAuditableEntity : BaseEntity
{
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

    /// <summary>
    /// Gets or sets the soft delete flag.
    /// </summary>
    public bool IsDeleted { get; set; } = false;
}
