using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Users.Queries.GetAuthenticatedUserInfo;

public record AuthUserDto
{
    public string Id { get; init; } = string.Empty;
    public string? Email { get; init; }
    public string? FirstName { get; init; }
    public string? MiddleName { get; init; }
    public string? LastName { get; init; }
    public List<string> Roles { get; init; } = new();

    private class Mapping : Profile
    {
        public Mapping()
        {
            // Map common properties from IIdentityServiceUser
            CreateMap<IIdentityServiceUser, AuthUserDto>()
                .ForMember(
                    d => d.Roles,
                    opt =>
                        opt.MapFrom(
                            (src, dest, destMember, context) =>
                                context.Items.TryGetValue("Roles", out var roles)
                                    ? (List<string>)roles
                                    : new List<string>()
                        )
                );
        }
    }
}
