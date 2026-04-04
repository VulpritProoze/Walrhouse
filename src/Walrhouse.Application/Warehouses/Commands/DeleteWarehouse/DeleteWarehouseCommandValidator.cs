using FluentValidation;

namespace Walrhouse.Application.Warehouses.Commands.DeleteWarehouse;

public class DeleteWarehouseCommandValidator : AbstractValidator<DeleteWarehouseCommand>
{
    public DeleteWarehouseCommandValidator()
    {
        RuleFor(x => x.WarehouseCode)
            .NotEmpty()
            .WithMessage("WarehouseCode is required.")
            .MaximumLength(64)
            .WithMessage("WarehouseCode must be at most 64 characters.");
    }
}
