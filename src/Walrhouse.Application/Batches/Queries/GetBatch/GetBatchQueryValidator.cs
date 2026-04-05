namespace Walrhouse.Application.Batches.Queries.GetBatch;

public class GetBatchQueryValidator : AbstractValidator<GetBatchQuery>
{
    public GetBatchQueryValidator()
    {
        RuleFor(x => x.BatchNumber)
            .NotEmpty()
            .WithMessage("BatchNumber is required.")
            .MaximumLength(64)
            .WithMessage("BatchNumber must be at most 64 characters.");
    }
}
