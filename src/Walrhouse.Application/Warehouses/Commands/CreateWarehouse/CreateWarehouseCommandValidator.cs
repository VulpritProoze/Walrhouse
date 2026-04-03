using FluentValidation;

namespace Walrhouse.Application.Warehouses.Commands.CreateWarehouse;

public class CreateWarehouseCommandValidator : AbstractValidator<CreateWarehouseCommand>
{
    public CreateWarehouseCommandValidator()
    {
        RuleFor(x => x.WarehouseCode)
            .NotEmpty()
            .WithMessage("WarehouseCode is required.")
            .MaximumLength(100)
            .WithMessage("WarehouseCode must be at most 100 characters.");

        RuleFor(x => x.WarehouseName)
            .MaximumLength(200)
            .WithMessage("WarehouseName must be at most 200 characters.");
    }
}
