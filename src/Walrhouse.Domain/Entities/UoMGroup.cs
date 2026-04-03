using System.Text.Json;

namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents a group of unit of measurements of an item.
/// </summary>
public class UoMGroup : BaseAuditableEntity
{
    private static readonly JsonSerializerOptions _uomJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    public string? UoMGroupLinesJson
    {
        get => JsonSerializer.Serialize(UoMGroupLines, _uomJsonOptions);
        private set =>
            UoMGroupLines = string.IsNullOrEmpty(value)
                ? new List<UoMGroupLine>()
                : JsonSerializer.Deserialize<List<UoMGroupLine>>(value, _uomJsonOptions)
                    ?? new List<UoMGroupLine>();
    }

    /// <summary>
    /// Gets or sets the unique UoM group entry.
    /// This is the unique identifier used in between relationships.
    /// </summary>
    public required string UgpEntry { get; set; }

    /// <summary>
    /// Gets or sets the BaseUoM.
    /// This is where the UoMGroupLines refer to with its BaseQty.
    /// </summary>
    public required UnitOfMeasurement BaseUoM { get; set; }

    /// <summary>
    /// Gets or sets a collection of UoMGroupLines.
    /// If, for example, we define an item to be measured in many measurements,
    /// say piece, or box, or bottle, we put those measurements here and their
    /// conversion factor (baseQty) against the BaseUoM (always 1 in baseQty).
    /// </summary>
    public ICollection<UoMGroupLine> UoMGroupLines { get; set; } = new List<UoMGroupLine>();
}

/// <summary>
/// Represents a line of UoMGroup.
/// This is where we define a conversion factor for a UoM in a group.
/// Note: This is not supposed to be mapped as a separate table in the database,
/// but rather stored as a JSON string in UoMGroupLinesJson of UoMGroup entity.
/// </summary>
public class UoMGroupLine
{
    /// <summary>
    /// Gets or sets the UoM.
    /// This is the unit of measurement that we want to define a conversion factor for.
    /// For example, if the BaseUoM is "piece", we can define a UoMGroupLine with UoM "box" and BaseQty 10,
    /// </summary>
    public required UnitOfMeasurement UoM { get; set; }

    /// <summary>
    /// Gets or sets the conversion factor to the BaseUoM.
    /// </summary>
    public int BaseQty { get; set; } = 1;
}
