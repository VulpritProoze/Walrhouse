using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Batches.Commands.CreateBatch;

public class CreateBatchCommandValidator : AbstractValidator<CreateBatchCommand>
{
    public CreateBatchCommandValidator(IApplicationDbContext _)
    {
        RuleFor(x => x.BatchNumber)
            .NotEmpty()
            .WithMessage("BatchNumber is required.")
            .MaximumLength(64)
            .WithMessage("BatchNumber must be at most 64 characters.");

        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .WithMessage("ItemCode is required.")
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");

        RuleFor(x => x.ExpiryDate).NotEmpty().WithMessage("ExpiryDate is required.");

        RuleFor(x => x.Status).IsInEnum().WithMessage("Status is invalid.");

        RuleFor(x => x.BinNo)
            .NotEmpty()
            .WithMessage("BinNo is required.")
            .MaximumLength(64)
            .WithMessage("BinNo must be at most 64 characters.");
    }
}
