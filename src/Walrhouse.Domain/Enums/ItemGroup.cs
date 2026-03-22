using System.ComponentModel.DataAnnotations;

namespace Walrhouse.Domain.Enums;

public enum ItemGroup
{
    [Display(Name = "General")]
    General = 1,

    [Display(Name = "Electronics")]
    Electronics = 2,

    [Display(Name = "Raw Materials")]
    RawMaterials = 3,
}
