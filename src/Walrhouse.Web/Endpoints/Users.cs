using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Users.Queries.GetAuthenticatedUser;
using Walrhouse.Application.Users.Queries.GetUser;
using Walrhouse.Domain.Constants;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Web.Endpoints;

public class Users : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapIdentityApi<ApplicationUser>();
        groupBuilder.MapPost(Logout, "logout").RequireAuthorization();
        groupBuilder.MapGet(GetAuthenticatedUser, "info").RequireAuthorization();
        groupBuilder
            .MapGet(GetUser, "{id}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(Logout))]
    [EndpointSummary("Log out the current user by clearing cookies.")]
    public static async Task<Results<Ok, UnauthorizedHttpResult>> Logout(
        SignInManager<ApplicationUser> signInManager,
        [FromBody] object empty
    )
    {
        if (empty != null)
        {
            await signInManager.SignOutAsync();
            return TypedResults.Ok();
        }

        return TypedResults.Unauthorized();
    }

    [EndpointName(nameof(GetAuthenticatedUser))]
    [EndpointSummary("Get authenticated user's information")]
    public static async Task<Results<Ok<AuthUserDto>, UnauthorizedHttpResult>> GetAuthenticatedUser(
        ISender sender
    )
    {
        var result = await sender.Send(new GetAuthenticatedUserQuery());

        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetUser))]
    [EndpointSummary("Get specific user information by ID")]
    public static async Task<Ok<UserDto>> GetUser(ISender sender, string id)
    {
        var result = await sender.Send(new GetUserQuery(id));

        return TypedResults.Ok(result);
    }
}
