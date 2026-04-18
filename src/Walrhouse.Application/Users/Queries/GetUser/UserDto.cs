using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Users.Queries.GetAuthenticatedUser;

namespace Walrhouse.Application.Users.Queries.GetUser;

public record UserDto : AuthUserDto
{
    public string? PhoneNumber { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<IIdentityServiceUser, UserDto>()
                .IncludeBase<IIdentityServiceUser, AuthUserDto>()
                .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber));
        }
    }
}
