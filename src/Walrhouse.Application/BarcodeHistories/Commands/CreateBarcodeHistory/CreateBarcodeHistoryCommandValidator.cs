namespace Walrhouse.Application.BarcodeHistories.Commands.CreateBarcodeHistory;

public class CreateBarcodeHistoryCommandValidator : AbstractValidator<CreateBarcodeHistoryCommand>
{
    public CreateBarcodeHistoryCommandValidator()
    {
        RuleFor(v => v.BarcodeValue)
            .NotEmpty()
            .WithMessage("BarcodeValue is required.")
            .MaximumLength(256)
            .WithMessage("BarcodeValue must be at most 256 characters.");

        RuleFor(v => v.BatchNumber)
            .NotEmpty()
            .WithMessage("BatchNumber is required.")
            .MaximumLength(64)
            .WithMessage("BatchNumber must be at most 64 characters.");

        RuleFor(v => v.BarcodeFormat).IsInEnum().WithMessage("Invalid barcode format.");

        RuleFor(v => v.Remarks)
            .MaximumLength(1024)
            .WithMessage("Remarks must be at most 1024 characters.");

        RuleFor(v => v.CreatedBy)
            .MaximumLength(128)
            .WithMessage("CreatedBy must be at most 128 characters.");
    }
}
