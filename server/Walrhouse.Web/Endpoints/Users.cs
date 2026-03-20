using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Users.Queries.GetAuthenticatedUserInfo;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        // Custom endpoints for full UX control over messages
        groupBuilder.MapPost(Login, "/login");
        groupBuilder.MapPost(Register, "/register");

        groupBuilder.MapPost(Logout, "logout").RequireAuthorization();
        groupBuilder.MapGet(GetAuthenticatedUserInfo, "info").RequireAuthorization();
    }

    [EndpointName(nameof(Login))]
    [EndpointSummary("Log in")]
    [EndpointDescription("Authenticates a user and returns a token or sets a cookie.")]
    public async Task<Results<Ok<AccessTokenResponse>, EmptyHttpResult, ProblemHttpResult>> Login(
        [FromBody] LoginRequest loginRequest,
        [FromQuery] bool? useCookies,
        [FromQuery] bool? useSessionCookies,
        SignInManager<ApplicationUser> signInManager
    )
    {
        var useCookieScheme = (useCookies == true) || (useSessionCookies == true);
        var isPersistent = (useCookies == true) && (useSessionCookies != true);

        signInManager.AuthenticationScheme = useCookieScheme
            ? IdentityConstants.ApplicationScheme
            : IdentityConstants.BearerScheme;

        var result = await signInManager.PasswordSignInAsync(
            loginRequest.Email,
            loginRequest.Password,
            isPersistent,
            lockoutOnFailure: true
        );

        if (result.Succeeded)
        {
            return TypedResults.Empty;
        }

        if (result.RequiresTwoFactor)
        {
            return TypedResults.Problem(
                "Two-factor authentication is required.",
                statusCode: StatusCodes.Status401Unauthorized
            );
        }

        if (result.IsLockedOut)
        {
            return TypedResults.Problem(
                "Your account is locked due to too many failed attempts. Please try again later.",
                statusCode: StatusCodes.Status403Forbidden
            );
        }

        if (result.IsNotAllowed)
        {
            return TypedResults.Problem(
                "Login is not allowed. Please ensure your email is confirmed.",
                statusCode: StatusCodes.Status401Unauthorized
            );
        }

        return TypedResults.Problem(
            "Invalid email or password.",
            statusCode: StatusCodes.Status401Unauthorized
        );
    }

    [EndpointName(nameof(Register))]
    [EndpointSummary("Register a new user")]
    public async Task<Results<Ok, ProblemHttpResult>> Register(
        [FromBody] RegisterRequest registerRequest,
        UserManager<ApplicationUser> userManager
    )
    {
        var user = new ApplicationUser
        {
            UserName = registerRequest.Email,
            Email = registerRequest.Email,
        };
        var result = await userManager.CreateAsync(user, registerRequest.Password);

        if (result.Succeeded)
        {
            return TypedResults.Ok();
        }

        var errors = result.Errors.ToDictionary(e => e.Code, e => new[] { e.Description });
        return TypedResults.Problem(
            "Registration failed.",
            extensions: new Dictionary<string, object?> { ["errors"] = errors },
            statusCode: StatusCodes.Status400BadRequest
        );
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

    public record LoginRequest(string Email, string Password);

    public record RegisterRequest(string Email, string Password);

    public record AccessTokenResponse(
        string TokenType,
        string AccessToken,
        long ExpiresIn,
        string RefreshToken
    );
}
