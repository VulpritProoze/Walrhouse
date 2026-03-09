using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Items.Commands.CreateItem;

public class CreateItemCommandValidator : AbstractValidator<CreateItemCommand>
{
    public CreateItemCommandValidator(IApplicationDbContext context)
    {
        RuleFor(v => v.ItemCode)
            .NotEmpty()
            .MaximumLength(50)
            .MustAsync(
                async (itemCode, cancellationToken) =>
                    await context.Items.AllAsync(i => i.ItemCode != itemCode, cancellationToken)
            )
            .WithMessage("The specified item code already exists.");

        RuleFor(v => v.ItemName).NotEmpty().MaximumLength(200);

        RuleFor(v => v.ItemGroup).IsInEnum();

        RuleFor(v => v.Remarks).MaximumLength(1000);
    }
}
