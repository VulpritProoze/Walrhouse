using System.Reflection;
using Walrhouse.Application.Common.Exceptions;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;

namespace Walrhouse.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior that handles authorization for MediatR requests based on Authorize attributes.
/// </summary>
/// <typeparam name="TRequest">The type of the request.</typeparam>
/// <typeparam name="TResponse">The type of the response.</typeparam>
public class AuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthorizationBehavior{TRequest, TResponse}"/> class.
    /// </summary>
    /// <param name="user">The current user service.</param>
    /// <param name="identityService">The identity service for checking policies.</param>
    public AuthorizationBehavior(IUser user, IIdentityService identityService)
    {
        _user = user;
        _identityService = identityService;
    }

    /// <summary>
    /// Handles the authorization logic for the specified request.
    /// </summary>
    /// <param name="request">The incoming request.</param>
    /// <param name="next">The next handler in the pipeline.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The response from the next handler in the pipeline.</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when the user is not authenticated but authorization is required.</exception>
    /// <exception cref="ForbiddenAccessException">Thrown when the user does not have the required roles or policies.</exception>
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

        if (authorizeAttributes.Any())
        {
            // Must be authenticated user
            if (_user.Id == null)
            {
                throw new UnauthorizedAccessException();
            }

            // Role-based authorization
            var authorizeAttributesWithRoles = authorizeAttributes.Where(a =>
                !string.IsNullOrWhiteSpace(a.Roles)
            );

            if (authorizeAttributesWithRoles.Any())
            {
                var authorized = false;

                foreach (var roles in authorizeAttributesWithRoles.Select(a => a.Roles.Split(',')))
                {
                    foreach (var role in roles)
                    {
                        var isInRole = _user.Roles?.Any(x => role == x) ?? false;
                        if (isInRole)
                        {
                            authorized = true;
                            break;
                        }
                    }
                }

                // Must be a member of at least one role in roles
                if (!authorized)
                {
                    throw new ForbiddenAccessException();
                }
            }

            // Policy-based authorization
            var authorizeAttributesWithPolicies = authorizeAttributes.Where(a =>
                !string.IsNullOrWhiteSpace(a.Policy)
            );
            if (authorizeAttributesWithPolicies.Any())
            {
                foreach (var policy in authorizeAttributesWithPolicies.Select(a => a.Policy))
                {
                    var authorized = await _identityService.AuthorizeAsync(_user.Id, policy);

                    if (!authorized)
                    {
                        throw new ForbiddenAccessException();
                    }
                }
            }
        }

        // User is authorized / authorization not required
        return await next();
    }
}
