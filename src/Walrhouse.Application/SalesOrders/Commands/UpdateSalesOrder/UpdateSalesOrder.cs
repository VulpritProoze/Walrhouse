using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.SalesOrders.Commands.CreateSalesOrder;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.SalesOrders.Commands.UpdateSalesOrder;

public record UpdateSalesOrderCommand : IRequest
{
    public int Id { get; init; }
    public DateTimeOffset? DueDate { get; init; }
    public SalesOrderStatus? Status { get; init; }
    public string? CustomerName { get; init; }
    public string? Remarks { get; init; }
    public ICollection<OrderLineDto>? OrderLines { get; init; }
}

public class UpdateSalesOrderCommandHandler : IRequestHandler<UpdateSalesOrderCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateSalesOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateSalesOrderCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.SalesOrders.FindAsync(
            new object[] { request.Id },
            cancellationToken
        );

        Guard.Against.NotFound(request.Id, entity);

        if (request.DueDate.HasValue)
            entity.DueDate = request.DueDate.Value;
        if (request.Status.HasValue)
            entity.Status = request.Status.Value;
        if (request.CustomerName != null)
            entity.CustomerName = request.CustomerName;
        if (request.Remarks != null)
            entity.Remarks = request.Remarks;

        if (request.OrderLines != null)
        {
            entity.OrderLines = request
                .OrderLines.Select(l => new OrderLine { BatchNumbers = l.BatchNumbers })
                .ToList();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
