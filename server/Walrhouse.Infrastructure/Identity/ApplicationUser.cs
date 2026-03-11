using Microsoft.AspNetCore.Identity;
using Walrhouse.Domain.ValueObjects;

namespace Walrhouse.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public UserAddress? Address { get; set; }
}
