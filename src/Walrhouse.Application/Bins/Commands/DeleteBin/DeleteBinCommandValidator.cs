namespace Walrhouse.Application.Bins.Commands.DeleteBin;

public class DeleteBinCommandValidator : AbstractValidator<DeleteBinCommand>
{
    public DeleteBinCommandValidator()
    {
        RuleFor(x => x.BinNo)
            .NotEmpty()
            .WithMessage("BinNo is required.")
            .MaximumLength(64)
            .WithMessage("BinNo must be at most 64 characters.");
    }
}
