using FluentValidation;
using Walrhouse.Application.Common.Interfaces;

namespace Walrhouse.Application.Warehouses.Commands.UpdateWarehouse;

public class UpdateWarehouseCommandValidator : AbstractValidator<UpdateWarehouseCommand>
{
    public UpdateWarehouseCommandValidator(IApplicationDbContext _)
    {
        RuleFor(x => x.WarehouseCode)
            .NotEmpty()
            .WithMessage("WarehouseCode is required.")
            .MaximumLength(64)
            .WithMessage("WarehouseCode must be at most 64 characters.");

        RuleFor(x => x.WarehouseName)
            .MaximumLength(200)
            .WithMessage("WarehouseName must be at most 200 characters.");
    }
}
