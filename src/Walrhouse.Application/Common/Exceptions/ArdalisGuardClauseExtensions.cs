namespace Walrhouse.Application.Common.Exceptions;

/// <summary>
/// Additional Guard clause helpers used across the application.
/// </summary>
public static class ArdalisGuardClauseExtensions
{
    /// <summary>
    /// Ensures the provided enum value (nullable) is a defined value of the enum type.
    /// If <paramref name="value"/> is null this method returns null and does not throw.
    /// If the enum value is not defined, an <see cref="ArgumentOutOfRangeException"/> is thrown.
    /// </summary>
    /// <typeparam name="TEnum">The enum type.</typeparam>
    /// <param name="guard">The guard clause instance.</param>
    /// <param name="value">The nullable enum value to validate.</param>
    /// <param name="parameterName">The name of the parameter being validated.</param>
    /// <param name="message">Optional custom error message forwarded to the exception.</param>
    /// <returns>The original value when valid; otherwise throws.</returns>
    public static TEnum? EnumNotFound<TEnum>(
        this IGuardClause guard,
        TEnum? value,
        string parameterName,
        string? message = null
    )
        where TEnum : struct, Enum
    {
        if (guard is null)
            throw new ArgumentNullException(nameof(guard));

        if (value is null)
            return null;

        if (!Enum.IsDefined(typeof(TEnum), value.Value))
            throw new ArgumentOutOfRangeException(
                parameterName,
                message ?? $"The value of '{parameterName}' is not a valid {typeof(TEnum).Name}."
            );

        return value;
    }
}
