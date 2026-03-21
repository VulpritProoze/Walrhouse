using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Users.Queries.GetAuthenticatedUserInfo;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapIdentityApi<ApplicationUser>();

        groupBuilder.MapPost(Logout, "logout").RequireAuthorization();
        groupBuilder.MapGet(GetAuthenticatedUserInfo, "info").RequireAuthorization();
    }

    [EndpointName(nameof(Logout))]
    [EndpointSummary("Log out")]
    public async Task<Results<Ok, UnauthorizedHttpResult>> Logout(
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

    [EndpointName(nameof(GetAuthenticatedUserInfo))]
    [EndpointSummary("Get authenticated user's information")]
    public async Task<Results<Ok<AuthUserDto>, UnauthorizedHttpResult>> GetAuthenticatedUserInfo(
        ISender sender
    )
    {
        var result = await sender.Send(new GetAuthenticatedUserInfoQuery());

        return TypedResults.Ok(result);
    }
}
