using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.SalesOrders.Commands.DeleteSalesOrder;

public record DeleteSalesOrderCommand(int Id) : IRequest;

public class DeleteSalesOrderCommandHandler : IRequestHandler<DeleteSalesOrderCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteSalesOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteSalesOrderCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.SalesOrders.FindAsync(
            new object[] { request.Id },
            cancellationToken
        );

        Guard.Against.NotFound(request.Id, entity);

        _context.SalesOrders.Remove(entity);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
