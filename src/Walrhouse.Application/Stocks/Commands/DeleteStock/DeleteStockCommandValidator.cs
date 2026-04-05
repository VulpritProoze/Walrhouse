namespace Walrhouse.Application.Stocks.Commands.DeleteStock;

public class DeleteStockCommandValidator : AbstractValidator<DeleteStockCommand>
{
    public DeleteStockCommandValidator()
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .WithMessage("ItemCode is required.")
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");
    }
}
