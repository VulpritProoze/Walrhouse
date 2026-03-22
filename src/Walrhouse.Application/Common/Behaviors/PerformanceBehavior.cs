using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior that tracks request execution time and logs a warning if it exceeds a predefined threshold.
/// </summary>
/// <typeparam name="TRequest">The type of the request.</typeparam>
/// <typeparam name="TResponse">The type of the response.</typeparam>
public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly Stopwatch _timer;
    private readonly ILogger<TRequest> _logger;
    private readonly IUser _user;
    private readonly IIdentityService _identityService;

    /// <summary>
    /// Initializes a new instance of the <see cref="PerformanceBehavior{TRequest, TResponse}"/> class.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    /// <param name="user">The current user service.</param>
    /// <param name="identityService">The identity service.</param>
    public PerformanceBehavior(
        ILogger<TRequest> logger,
        IUser user,
        IIdentityService identityService
    )
    {
        _timer = new Stopwatch();

        _logger = logger;
        _user = user;
        _identityService = identityService;
    }

    /// <summary>
    /// Measures the execution time of the request and logs a warning if it takes longer than 500ms.
    /// </summary>
    /// <param name="request">The request being processed.</param>
    /// <param name="next">The next handler in the pipeline.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>The response from the next handler.</returns>
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        _timer.Start();

        var response = await next();

        _timer.Stop();

        var elapsedMilliseconds = _timer.ElapsedMilliseconds;

        if (elapsedMilliseconds > 500)
        {
            var requestName = typeof(TRequest).Name;
            var userId = _user.Id ?? string.Empty;
            var userName = string.Empty;

            if (!string.IsNullOrEmpty(userId))
            {
                userName = await _identityService.GetUserNameAsync(userId);
            }

            _logger.LogWarning(
                "Walrhouse Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@UserName} {@Request}",
                requestName,
                elapsedMilliseconds,
                userId,
                userName,
                request
            );
        }

        return response;
    }
}
