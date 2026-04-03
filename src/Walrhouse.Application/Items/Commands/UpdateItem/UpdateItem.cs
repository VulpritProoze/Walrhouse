using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

public record UpdateItemCommand : IRequest { }

public class UpdateItemCommandHandler : IRequestHandler<UpdateItemCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateItemCommand request, CancellationToken cancellationToken)
    {
        return;
    }
}
