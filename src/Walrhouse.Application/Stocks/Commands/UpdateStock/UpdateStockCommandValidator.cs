using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Stocks.Commands.UpdateStock;

public class UpdateStockCommandValidator : AbstractValidator<UpdateStockCommand>
{
    public UpdateStockCommandValidator(IApplicationDbContext _)
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .WithMessage("ItemCode is required.")
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");

        RuleFor(x => x.QuantityOnHand)
            .GreaterThanOrEqualTo(0)
            .WithMessage("QuantityOnHand must be 0 or greater.")
            .When(x => x.QuantityOnHand is not null);
    }
}
