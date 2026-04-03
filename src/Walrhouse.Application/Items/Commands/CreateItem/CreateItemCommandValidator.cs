using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Items.Commands.CreateItem;

public class CreateItemCommandValidator : AbstractValidator<CreateItemCommand>
{
    public CreateItemCommandValidator(IApplicationDbContext context) { }
}
