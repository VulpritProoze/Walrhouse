using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

public class UpdateItemCommandValidator : AbstractValidator<UpdateItemCommand>
{
    public UpdateItemCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.ItemCode).NotEmpty().MaximumLength(50);

        RuleFor(v => v.ItemName).NotEmpty().MaximumLength(200);

        RuleFor(v => v.Remarks).MaximumLength(1000);
    }
}
