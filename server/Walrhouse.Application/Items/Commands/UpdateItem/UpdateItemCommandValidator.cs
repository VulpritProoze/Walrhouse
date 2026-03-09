using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

public class UpdateItemCommandValidator : AbstractValidator<UpdateItemCommand>
{
    public UpdateItemCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.Id).GreaterThan(0);

        RuleFor(v => v.ItemCode)
            .NotEmpty()
            .MaximumLength(50)
            .MustAsync(
                async (command, itemCode, cancellationToken) =>
                    await context
                        .Items.Where(i => i.ItemId != command.Id)
                        .AllAsync(i => i.ItemCode != itemCode, cancellationToken)
            )
            .WithMessage("The specified item code already exists.");

        RuleFor(v => v.ItemName).NotEmpty().MaximumLength(200);

        RuleFor(v => v.Remarks).MaximumLength(1000);
    }
}
