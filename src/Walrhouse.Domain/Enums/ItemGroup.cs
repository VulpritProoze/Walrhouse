using System.ComponentModel.DataAnnotations;

namespace Walrhouse.Domain.Enums;

public enum ItemGroup
{
    [Display(Name = "General")]
    General = 1,

    [Display(Name = "Medical Supplies")]
    Medicines = 2,
}
