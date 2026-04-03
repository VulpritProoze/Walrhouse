using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Security;
using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Commands.CreateItem;

public record CreateItemCommand : IRequest<string> { }

public class CreateItemCommandHandler : IRequestHandler<CreateItemCommand, string>
{
    private readonly IApplicationDbContext _context;

    public CreateItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(CreateItemCommand request, CancellationToken cancellationToken)
    {
        return "";
    }
}
