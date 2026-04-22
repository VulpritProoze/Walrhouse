namespace Walrhouse.Application.SalesOrders.Commands.UpdateSalesOrder;

public class UpdateSalesOrderCommandValidator : AbstractValidator<UpdateSalesOrderCommand>
{
    public UpdateSalesOrderCommandValidator()
    {
        RuleFor(v => v.Id).NotEmpty().WithMessage("Id is required.");

        RuleFor(v => v.CustomerName).MaximumLength(256);

        RuleFor(v => v.Remarks).MaximumLength(1024);

        RuleForEach(v => v.OrderLines)
            .ChildRules(line =>
            {
                line.RuleFor(l => l.ItemCode).NotEmpty().WithMessage("ItemCode is required.");

                line.RuleFor(l => l.OrderedQty)
                    .GreaterThan(-1)
                    .WithMessage("Ordered quantity must be greater than 0.");

                line.RuleFor(l => l.PickedQty)
                    .GreaterThanOrEqualTo(-1)
                    .WithMessage("Picked quantity must be a non-negative number.");
            });
    }
}
