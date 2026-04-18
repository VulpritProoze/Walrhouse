using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Users.Queries.GetUser;

public record GetUserQuery(string Id) : IRequest<UserDto>;

public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
{
    public GetUserQueryValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("User ID is required.");
    }
}

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserDto>
{
    private readonly IIdentityService _identityService;
    private readonly IMapper _mapper;

    public GetUserQueryHandler(IIdentityService identityService, IMapper mapper)
    {
        _identityService = identityService;
        _mapper = mapper;
    }

    public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var (result, user) = await _identityService.GetUserByIdAsync(request.Id);

        if (!result.Succeeded || user == null)
        {
            throw new Exception($"User with ID {request.Id} not found.");
        }

        var (roleResult, roles) = await _identityService.GetUserRolesAsync(request.Id);

        return _mapper.Map<UserDto>(
            user,
            opt =>
            {
                opt.Items["Roles"] = roles;
            }
        );
    }
}
