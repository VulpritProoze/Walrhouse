using MediatR.Pipeline;
using Microsoft.Extensions.Logging;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Common.Behaviors;

/// <summary>
/// Pre-processor for requests that logs the request name, user ID, user name, and request details.
/// </summary>
/// <typeparam name="TRequest">The type of the request being processed.</typeparam>
public class LoggingBehavior<TRequest> : IRequestPreProcessor<TRequest>
    where TRequest : notnull
{
    private readonly ILogger _logger;
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    /// <summary>
    /// Initializes a new instance of the <see cref="LoggingBehavior{TRequest}"/> class.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    /// <param name="user">The current user service.</param>
    /// <param name="identityService">The identity service.</param>
    public LoggingBehavior(ILogger<TRequest> logger, IUser user, IIdentityService identityService)
    {
        _logger = logger;
        _user = user;
        _identityService = identityService;
    }

    /// <summary>
    /// Processes the incoming request and logs relevant information.
    /// </summary>
    /// <param name="request">The request being processed.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
    public async Task Process(TRequest request, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = _user.Id ?? string.Empty;
        string? userName = string.Empty;

        if (!string.IsNullOrEmpty(userId))
        {
            userName = await _identityService.GetUserNameAsync(userId);
        }

        _logger.LogInformation(
            "Walrhouse Request: {Name} {@UserId} {@UserName} {@Request}",
            requestName,
            userId,
            userName,
            request
        );
    }
}
