using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);

    Task<(Result Result, IIdentityServiceUser? User)> GetUserByIdAsync(string userId);

    Task<(Result Result, List<string> Roles)> GetUserRolesAsync(string userId);
}
