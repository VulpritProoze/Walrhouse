using System.Collections.ObjectModel;

namespace Walrhouse.Domain.Entities;

/// <summary>
/// Represents an inventory item in the warehouse management system.
/// </summary>
public class UoMGroup : BaseAuditableEntity
{
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
    public Collection<UoMGroupLine> UoMGroupLines { get; set; } = new Collection<UoMGroupLine>();
}

/// <summary>
/// Represents a line of UoMGroup.
/// This is where we define a conversion factor for a UoM in a group.
/// </summary>
public class UoMGroupLine
{
    public required UnitOfMeasurement UoM { get; set; }
    public int BaseQty { get; set; } = 1;
}
