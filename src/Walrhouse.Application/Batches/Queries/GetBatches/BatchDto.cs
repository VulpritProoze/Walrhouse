using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Batches.Queries.GetBatches;

public class BatchDto
{
    public string BatchNumber { get; set; } = string.Empty;
    public string ItemCode { get; set; } = string.Empty;
    public DateTimeOffset ExpiryDate { get; set; }
    public BatchStatus Status { get; set; }
    public string BinNo { get; set; } = string.Empty;

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Batch, BatchDto>();
        }
    }
}
