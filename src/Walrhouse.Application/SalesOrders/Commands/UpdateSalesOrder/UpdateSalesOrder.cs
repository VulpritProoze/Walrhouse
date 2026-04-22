using Walrhouse.Application.Common.Exceptions;
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
    public ICollection<UpdateOrderLineDto>? OrderLines { get; init; }
}

public record UpdateOrderLineDto
{
    public string? DocEntry { get; init; }
    public required string ItemCode { get; init; }
    public string UnitOfMeasure { get; init; } = string.Empty;
    public int OrderedQty { get; init; }
    public int PickedQty { get; init; }
}

public class UpdateSalesOrderCommandHandler : IRequestHandler<UpdateSalesOrderCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;

    public UpdateSalesOrderCommandHandler(IApplicationDbContext context, IUser user)
    {
        _context = context;
        _user = user;
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
        {
            switch (request.Status.Value)
            {
                case SalesOrderStatus.Open:
                    entity.Open();
                    break;
                case SalesOrderStatus.Closed:
                    if (string.IsNullOrEmpty(_user.Id))
                    {
                        throw new ForbiddenAccessException();
                    }
                    entity.Close(_user.Id);
                    break;
                case SalesOrderStatus.Cancelled:
                    entity.Cancel();
                    break;
            }
        }

        if (request.CustomerName != null)
            entity.CustomerName = request.CustomerName;
        if (request.Remarks != null)
            entity.Remarks = request.Remarks;

        if (request.OrderLines != null)
        {
            entity.OrderLines = request
                .OrderLines.Select(l =>
                {
                    var line = new OrderLine
                    {
                        ItemCode = l.ItemCode,
                        UnitOfMeasure = l.UnitOfMeasure,
                        OrderedQty = l.OrderedQty,
                        PickedQty = l.PickedQty,
                    };

                    if (!string.IsNullOrEmpty(l.DocEntry))
                    {
                        line.DocEntry = l.DocEntry;
                    }

                    return line;
                })
                .ToList();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
