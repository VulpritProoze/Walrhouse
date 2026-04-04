namespace Walrhouse.Application.Warehouses.Commands.CreateWarehouse;

public class CreateWarehouseCommandValidator : AbstractValidator<CreateWarehouseCommand>
{
    public CreateWarehouseCommandValidator()
    {
        RuleFor(x => x.WarehouseCode)
            .NotEmpty()
            .WithMessage("WarehouseCode is required.")
            .MaximumLength(64)
            .WithMessage("WarehouseCode must be at most 64 characters.");

        RuleFor(x => x.WarehouseName)
            .MaximumLength(256)
            .WithMessage("WarehouseName must be at most 256 characters.");
    }
}
