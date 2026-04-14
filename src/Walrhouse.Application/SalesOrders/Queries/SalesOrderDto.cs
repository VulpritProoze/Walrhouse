using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.SalesOrders.Queries;

public record SalesOrderDto
{
    public int Id { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    public SalesOrderStatus? Status { get; init; }
    public string? ClosedBy { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string Remarks { get; init; } = string.Empty;
    public ICollection<OrderLineDto> OrderLines { get; init; } = new List<OrderLineDto>();
}

public record OrderLineDto
{
    public string DocEntry { get; init; } = string.Empty;
    public string ItemCode { get; init; } = string.Empty;
    public string UnitOfMeasure { get; init; } = string.Empty;
    public int OrderedQty { get; init; }
    public int PickedQty { get; init; }
}

public class SalesOrderDtoProfile : Profile
{
    public SalesOrderDtoProfile()
    {
        CreateMap<SalesOrder, SalesOrderDto>();
        CreateMap<OrderLine, OrderLineDto>();
    }
}
