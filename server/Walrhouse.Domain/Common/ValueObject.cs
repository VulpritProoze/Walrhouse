namespace Walrhouse.Domain.Common;

/// <summary>
/// Base type for domain value objects that use structural equality.
/// </summary>
public abstract class ValueObject
{
    /// <summary>
    /// Compares two value objects using value semantics.
    /// </summary>
    /// <param name="left">The left value object.</param>
    /// <param name="right">The right value object.</param>
    /// <returns><c>true</c> when both values are equal; otherwise <c>false</c>.</returns>
    protected static bool EqualOperator(ValueObject left, ValueObject right)
    {
        if (left is null ^ right is null)
        {
            return false;
        }

        return left?.Equals(right!) != false;
    }

    /// <summary>
    /// Compares two value objects for inequality using value semantics.
    /// </summary>
    /// <param name="left">The left value object.</param>
    /// <param name="right">The right value object.</param>
    /// <returns><c>true</c> when both values are not equal; otherwise <c>false</c>.</returns>
    protected static bool NotEqualOperator(ValueObject left, ValueObject right)
    {
        return !(EqualOperator(left, right));
    }

    /// <summary>
    /// Returns the ordered set of components that participate in equality checks.
    /// </summary>
    /// <returns>An ordered sequence of equality components.</returns>
    protected abstract IEnumerable<object> GetEqualityComponents();

    /// <summary>
    /// Determines whether the specified object is equal to the current value object.
    /// </summary>
    /// <param name="obj">The object to compare with the current value object.</param>
    /// <returns><c>true</c> if the specified object is equal to the current value object; otherwise <c>false</c>.</returns>
    public override bool Equals(object? obj)
    {
        if (obj == null || obj.GetType() != GetType())
        {
            return false;
        }

        var other = (ValueObject)obj;
        return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
    }

    /// <summary>
    /// Returns a hash code for this value object based on its equality components.
    /// </summary>
    /// <returns>A hash code for the current value object.</returns>
    public override int GetHashCode()
    {
        var hash = new HashCode();

        foreach (var component in GetEqualityComponents())
        {
            hash.Add(component);
        }

        return hash.ToHashCode();
    }

    /// <summary>
    /// Determines whether two value objects are equal.
    /// </summary>
    /// <param name="left">The left value object.</param>
    /// <param name="right">The right value object.</param>
    /// <returns><c>true</c> if both values are equal; otherwise <c>false</c>.</returns>
    public static bool operator ==(ValueObject left, ValueObject right)
    {
        return EqualOperator(left, right);
    }

    /// <summary>
    /// Determines whether two value objects are not equal.
    /// </summary>
    /// <param name="left">The left value object.</param>
    /// <param name="right">The right value object.</param>
    /// <returns><c>true</c> if both values are not equal; otherwise <c>false</c>.</returns>
    public static bool operator !=(ValueObject left, ValueObject right)
    {
        return NotEqualOperator(left, right);
    }
}
