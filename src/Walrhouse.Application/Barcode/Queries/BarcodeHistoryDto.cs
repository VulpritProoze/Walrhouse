using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Barcode.Queries;

public class BarcodeHistoryDto
{
    public int Id { get; set; }
    public string BarcodeValue { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public BarcodeFormat? BarcodeFormat { get; set; }
    public string? Remarks { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? CreatedBy { get; set; }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<BarcodeHistory, BarcodeHistoryDto>();
        }
    }
}
