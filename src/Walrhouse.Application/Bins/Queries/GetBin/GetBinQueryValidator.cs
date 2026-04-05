namespace Walrhouse.Application.Bins.Queries.GetBin;

public class GetBinQueryValidator : AbstractValidator<GetBinQuery>
{
    public GetBinQueryValidator()
    {
        RuleFor(x => x.BinNo)
            .NotEmpty()
            .WithMessage("BinNo is required.")
            .MaximumLength(64)
            .WithMessage("BinNo must be at most 64 characters.");
    }
}
