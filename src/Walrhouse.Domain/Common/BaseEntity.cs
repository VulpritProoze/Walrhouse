using System.ComponentModel.DataAnnotations.Schema;

namespace Walrhouse.Domain.Common;

/// <summary>
/// Base type for domain entities with identity and domain event support.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Gets or sets the primary key identifier.
    /// </summary>
    public int Id { get; set; }

    private readonly List<BaseEvent> _domainEvents = new();

    /// <summary>
    /// Gets the read-only collection of domain events raised by the entity.
    /// </summary>
    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    /// <summary>
    /// Adds a domain event to the entity.
    /// </summary>
    /// <param name="domainEvent">The domain event to add.</param>
    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    /// <summary>
    /// Removes a domain event from the entity.
    /// </summary>
    /// <param name="domainEvent">The domain event to remove.</param>
    public void RemoveDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }

    /// <summary>
    /// Clears all domain events currently associated with the entity.
    /// </summary>
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}
