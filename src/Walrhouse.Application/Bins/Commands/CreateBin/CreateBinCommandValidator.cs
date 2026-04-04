using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Bins.Commands.CreateBin;

public class CreateBinCommandValidator : AbstractValidator<CreateBinCommand>
{
    public CreateBinCommandValidator(IApplicationDbContext _)
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

        RuleFor(x => x.WarehouseCode)
            .NotEmpty()
            .WithMessage("WarehouseCode is required.")
            .MaximumLength(64)
            .WithMessage("WarehouseCode must be at most 64 characters.");
    }
}
