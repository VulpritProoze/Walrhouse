using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Bins.Queries.GetBins;

public class BinDto
{
    public string BinNo { get; init; } = string.Empty;
    public string BinName { get; init; } = string.Empty;
    public string WarehouseCode { get; init; } = string.Empty;

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Bin, BinDto>();
        }
    }
}
