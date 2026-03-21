using Walrhouse.Domain.ValueObjects;

namespace Walrhouse.Application.Common.Interfaces;

/// <summary>
/// A project-wide abstraction for an Identity User.
/// Allows the Application layer to access user data without depending on Infrastructure-specific types.
/// </summary>
public interface IIdentityServiceUser
{
    string Id { get; }
    string? UserName { get; }
    string? Email { get; }
    UserAddress? Address { get; }
    string FirstName { get; }
    string? MiddleName { get; }
    string LastName { get; }
}
