namespace Walrhouse.Application.Stocks.Queries.GetStock;

public class GetStockQueryValidator : AbstractValidator<GetStockQuery>
{
    public GetStockQueryValidator()
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .WithMessage("ItemCode is required.")
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");
    }
}
