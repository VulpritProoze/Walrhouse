namespace Walrhouse.Application.Warehouses.Queries.GetWarehouse;

public class GetWarehouseQueryValidator : AbstractValidator<GetWarehouseQuery>
{
    public GetWarehouseQueryValidator()
    {
        RuleFor(x => x.WarehouseCode)
            .NotEmpty()
            .WithMessage("WarehouseCode is required.")
            .MaximumLength(64)
            .WithMessage("WarehouseCode must be at most 64 characters.");
    }
}
