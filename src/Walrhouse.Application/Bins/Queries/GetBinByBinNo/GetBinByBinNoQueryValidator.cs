namespace Walrhouse.Application.Bins.Queries.GetBinByBinNo;

public class GetBinByBinNoQueryValidator : AbstractValidator<GetBinByBinNoQuery>
{
    public GetBinByBinNoQueryValidator()
    {
        RuleFor(x => x.BinNo)
            .NotEmpty()
            .WithMessage("BinNo is required.")
            .MaximumLength(64)
            .WithMessage("BinNo must be at most 64 characters.");
    }
}
