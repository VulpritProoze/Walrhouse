namespace Walrhouse.Application.Common.Interfaces;

/// <summary>
/// Represents the authenticated application user context.
/// </summary>
public interface IUser
{
    /// <summary>
    /// Gets the unique identifier of the current user.
    /// </summary>
    string? Id { get; }

    /// <summary>
    /// Gets the role names assigned to the current user.
    /// </summary>
    List<string>? Roles { get; }
}
