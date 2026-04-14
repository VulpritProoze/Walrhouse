using System.ComponentModel.DataAnnotations;

namespace Walrhouse.Domain.Enums;

public enum SalesOrderStatus
{
    [Display(Name = "Open")]
    Open = 1,

    [Display(Name = "Closed")]
    Closed = 2,

    [Display(Name = "Cancelled")]
    Cancelled = 3,
}
