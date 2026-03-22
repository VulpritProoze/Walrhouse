using MediatR;

namespace Walrhouse.Domain.Common;

/// <summary>
/// Base type for domain events published through MediatR notifications.
/// </summary>
public abstract class BaseEvent : INotification { }
