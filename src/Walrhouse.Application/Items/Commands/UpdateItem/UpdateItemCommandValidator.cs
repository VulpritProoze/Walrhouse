using FluentValidation;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Items.Commands.UpdateItem;

public class UpdateItemCommandValidator : AbstractValidator<UpdateItemCommand>
{
    public UpdateItemCommandValidator(IApplicationDbContext _)
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .WithMessage("ItemCode is required.")
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");

        RuleFor(x => x.ItemName)
            .MaximumLength(256)
            .WithMessage("ItemName must be at most 256 characters.");

        RuleFor(x => x.ItemGroup).IsInEnum().WithMessage("Invalid ItemGroup value.");
        RuleFor(x => x.BarcodeFormat).IsInEnum().WithMessage("Invalid BarcodeFormat value.");

        RuleFor(x => x.UgpEntry)
            .MaximumLength(64)
            .WithMessage("UgpEntry must be at most 64 characters.");

        RuleFor(x => x.BarcodeValue)
            .MaximumLength(256)
            .WithMessage("BarcodeValue must be at most 256 characters.");

        RuleFor(x => x.Remarks)
            .MaximumLength(1024)
            .WithMessage("Remarks must be at most 1024 characters.");
    }
}
