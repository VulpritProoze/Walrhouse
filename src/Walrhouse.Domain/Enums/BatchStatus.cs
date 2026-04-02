using System.ComponentModel.DataAnnotations;

namespace Walrhouse.Domain.Enums;

public enum BatchStatus
{
    [Display(Name = "Released")]
    Released = 1,

    [Display(Name = "Locked")]
    Locked = 2,

    [Display(Name = "Restricted")]
    Restricted = 3,
}
