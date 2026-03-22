using Microsoft.AspNetCore.Identity;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.ValueObjects;

namespace Walrhouse.Infrastructure.Identity;

/// <summary>
/// Represents the application user, extending the default IdentityUser with custom profile fields.
/// </summary>
public class ApplicationUser : IdentityUser, IIdentityServiceUser
{
    /// <summary>
    /// Gets or sets the physical address associated with this user account.
    /// </summary>
    public UserAddress? Address { get; set; }

    /// <summary>
    /// Gets or sets the user's legal first name.
    /// </summary>
    public string FirstName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the user's middle name, if applicable.
    /// </summary>
    public string? MiddleName { get; set; }

    /// <summary>
    /// Gets or sets the user's legal last name.
    /// </summary>
    public string LastName { get; set; } = null!;
}
