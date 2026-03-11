namespace Walrhouse.Domain.ValueObjects;

/// <summary>
/// Represents a user address as an immutable value object.
/// Equality is based on the full set of address components.
/// </summary>
public sealed class UserAddress : ValueObject
{
    /// <summary>
    /// Gets the first address line (street or primary location detail).
    /// </summary>
    public string Line1 { get; }

    /// <summary>
    /// Gets the optional second address line (apartment, suite, floor, etc.).
    /// </summary>
    public string? Line2 { get; }

    /// <summary>
    /// Gets the city name.
    /// </summary>
    public string City { get; }

    /// <summary>
    /// Gets the state, province, or region.
    /// </summary>
    public string StateOrProvince { get; }

    /// <summary>
    /// Gets the postal or ZIP code.
    /// </summary>
    public string PostalCode { get; }

    /// <summary>
    /// Gets the country.
    /// </summary>
    public string Country { get; }

    private UserAddress(
        string line1,
        string? line2,
        string city,
        string stateOrProvince,
        string postalCode,
        string country
    )
    {
        Line1 = line1;
        Line2 = line2;
        City = city;
        StateOrProvince = stateOrProvince;
        PostalCode = postalCode;
        Country = country;
    }

    public static UserAddress Create(
        string line1,
        string? line2,
        string city,
        string stateOrProvince,
        string postalCode,
        string country
    )
    {
        if (string.IsNullOrWhiteSpace(line1))
            throw new ArgumentException("Line1 is required.");
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentException("City is required.");
        if (string.IsNullOrWhiteSpace(stateOrProvince))
            throw new ArgumentException("State/Province is required.");
        if (string.IsNullOrWhiteSpace(postalCode))
            throw new ArgumentException("PostalCode is required.");
        if (string.IsNullOrWhiteSpace(country))
            throw new ArgumentException("Country is required.");

        return new UserAddress(
            line1.Trim(),
            string.IsNullOrWhiteSpace(line2) ? null : line2.Trim(),
            city.Trim(),
            stateOrProvince.Trim(),
            postalCode.Trim(),
            country.Trim()
        );
    }

    /// <summary>
    /// Returns the components that define address value equality.
    /// </summary>
    /// <returns>An ordered sequence of values used for equality and hashing.</returns>
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Line1;
        yield return Line2 ?? string.Empty;
        yield return City;
        yield return StateOrProvince;
        yield return PostalCode;
        yield return Country;
    }
}
