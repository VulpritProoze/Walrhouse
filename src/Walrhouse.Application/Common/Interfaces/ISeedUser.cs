namespace Walrhouse.Application.Common.Interfaces;

public interface ISeedUser
{
    public string Email { get; }
    public string Password { get; }
    public string FirstName { get; }
    public string LastName { get; }
}
