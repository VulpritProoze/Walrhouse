using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Bins.Commands.UpdateBin;

public class UpdateBinCommandValidator : AbstractValidator<UpdateBinCommand>
{
    public UpdateBinCommandValidator(IApplicationDbContext _)
    {
        RuleFor(x => x.BinNo)
            .NotEmpty()
            .WithMessage("BinNo is required.")
            .MaximumLength(64)
            .WithMessage("BinNo must be at most 64 characters.");

        RuleFor(x => x.BinName)
            .NotEmpty()
            .WithMessage("BinName is required.")
            .MaximumLength(256)
            .WithMessage("BinName must be at most 256 characters.");
    }
}
