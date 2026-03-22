namespace Walrhouse.Domain.Exceptions;

public class ItemException : Exception
{
    public ItemException(string message)
        : base(message) { }
}
