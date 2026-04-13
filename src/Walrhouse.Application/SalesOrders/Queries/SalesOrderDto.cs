using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.SalesOrders.Queries;

public record SalesOrderDto
{
    public int Id { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    public SalesOrderStatus? Status { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string Remarks { get; init; } = string.Empty;
    public ICollection<OrderLineDto> OrderLines { get; init; } = new List<OrderLineDto>();
}

public record OrderLineDto
{
    public string DocEntry { get; init; } = string.Empty;
    public ICollection<string> BatchNumbers { get; init; } = new List<string>();
}

public class SalesOrderDtoProfile : Profile
{
    public SalesOrderDtoProfile()
    {
        CreateMap<SalesOrder, SalesOrderDto>();
        CreateMap<OrderLine, OrderLineDto>();
    }
}
