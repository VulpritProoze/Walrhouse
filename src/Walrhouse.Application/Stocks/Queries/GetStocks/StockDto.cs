using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Stocks.Queries.GetStocks;

public class StockDto
{
    public string ItemCode { get; set; } = string.Empty;
    public int QuantityOnHand { get; set; }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Stock, StockDto>();
        }
    }
}
