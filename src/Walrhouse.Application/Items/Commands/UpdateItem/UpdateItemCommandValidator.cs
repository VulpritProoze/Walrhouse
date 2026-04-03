using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

public class UpdateItemCommandValidator : AbstractValidator<UpdateItemCommand>
{
    public UpdateItemCommandValidator(IApplicationDbContext context) { }
}
