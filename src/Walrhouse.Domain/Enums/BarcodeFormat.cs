using System.ComponentModel.DataAnnotations;

namespace Walrhouse.Domain.Enums;

public enum BarcodeFormat
{
    [Display(Name = "GS1 DataMatrix")]
    GS1DataMatrix = 1,

    [Display(Name = "GS1 128")]
    GS1_128 = 2,

    [Display(Name = "QR Code")]
    QRCode = 3,

    [Display(Name = "Code 39")]
    Code39 = 4,
}
