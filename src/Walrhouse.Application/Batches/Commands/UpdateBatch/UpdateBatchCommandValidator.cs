using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Batches.Commands.UpdateBatch;

public class UpdateBatchCommandValidator : AbstractValidator<UpdateBatchCommand>
{
    public UpdateBatchCommandValidator(IApplicationDbContext _)
    {
        RuleFor(x => x.BatchNumber)
            .NotEmpty()
            .WithMessage("BatchNumber is required.")
            .MaximumLength(64)
            .WithMessage("BatchNumber must be at most 64 characters.");

        RuleFor(x => x.ItemCode)
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");

        RuleFor(x => x.Status).IsInEnum().WithMessage("Status is invalid.");

        RuleFor(x => x.BinNo).MaximumLength(64).WithMessage("BinNo must be at most 64 characters.");
    }
}
