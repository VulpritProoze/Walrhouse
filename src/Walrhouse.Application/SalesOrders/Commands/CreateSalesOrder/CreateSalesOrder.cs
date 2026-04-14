using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.SalesOrders.Commands.CreateSalesOrder;

public record CreateSalesOrderCommand : IRequest<int>
{
    public DateTimeOffset? DueDate { get; init; }
    public string? CustomerName { get; init; }
    public string? Remarks { get; init; }
    public required ICollection<OrderLineDto> OrderLines { get; init; }
}

public record OrderLineDto
{
    public required ICollection<string> BatchNumbers { get; init; }
}

public class CreateSalesOrderCommandHandler : IRequestHandler<CreateSalesOrderCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateSalesOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(
        CreateSalesOrderCommand request,
        CancellationToken cancellationToken
    )
    {
        var entity = new SalesOrder
        {
            DueDate = request.DueDate,
            CustomerName = request.CustomerName,
            Remarks = request.Remarks,
            OrderLines = request
                .OrderLines.Select(l => new OrderLine { BatchNumbers = l.BatchNumbers })
                .ToList(),
        };

        _context.SalesOrders.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
