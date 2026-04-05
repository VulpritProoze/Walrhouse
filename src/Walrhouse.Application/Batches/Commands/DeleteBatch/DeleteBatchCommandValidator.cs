namespace Walrhouse.Application.Batches.Commands.DeleteBatch;

public class DeleteBatchCommandValidator : AbstractValidator<DeleteBatchCommand>
{
    public DeleteBatchCommandValidator()
    {
        RuleFor(x => x.BatchNumber)
            .NotEmpty()
            .WithMessage("BatchNumber is required.")
            .MaximumLength(64)
            .WithMessage("BatchNumber must be at most 64 characters.");
    }
}
