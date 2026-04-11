using System.ComponentModel.DataAnnotations;

namespace Walrhouse.Domain.Enums;

// Unused enum - switched to string for UoMGroup entity
public enum UnitOfMeasurement
{
    [Display(Name = "Tab")]
    Tab = 1,

    [Display(Name = "Bottle")]
    Bottle = 2,

    [Display(Name = "Box")]
    Box = 3,
}
