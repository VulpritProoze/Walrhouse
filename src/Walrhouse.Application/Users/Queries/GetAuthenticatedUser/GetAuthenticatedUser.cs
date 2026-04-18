using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Models;

namespace Walrhouse.Application.Users.Queries.GetAuthenticatedUser;

public record GetAuthenticatedUserQuery : IRequest<AuthUserDto>;

public class GetAuthenticatedUserQueryHandler
    : IRequestHandler<GetAuthenticatedUserQuery, AuthUserDto>
{
    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;
    private readonly IUser _currentUser;

    public GetAuthenticatedUserQueryHandler(
        IIdentityService identityService,
        IMapper mapper,
        IUser currentUser
    )
    {
        _identityService = identityService;
        _mapper = mapper;
        _currentUser = currentUser;
    }

    public async Task<AuthUserDto> Handle(
        GetAuthenticatedUserQuery request,
        CancellationToken cancellationToken
    )
    {
        if (_currentUser.Id == null)
            throw new UnauthorizedAccessException();

        var rawUserInfo = await _identityService.GetUserByIdAsync(_currentUser.Id);
        var roles = await _identityService.GetUserRolesAsync(_currentUser.Id);

        if (rawUserInfo.Result.Succeeded && roles.Result.Succeeded)
        {
            return _mapper.Map<AuthUserDto>(
                rawUserInfo.User,
                opt => opt.Items["Roles"] = roles.Roles
            );
        }

        throw new UnauthorizedAccessException();
    }
}
