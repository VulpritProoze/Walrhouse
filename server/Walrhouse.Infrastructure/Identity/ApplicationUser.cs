using Microsoft.AspNetCore.Identity;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.ValueObjects;

namespace Walrhouse.Infrastructure.Identity;

public class ApplicationUser : IdentityUser, IIdentityServiceUser
{
    public UserAddress? Address { get; set; }
}
