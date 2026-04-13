namespace Walrhouse.Application.SalesOrders.Commands.CreateSalesOrder;

public class CreateSalesOrderCommandValidator : AbstractValidator<CreateSalesOrderCommand>
{
    public CreateSalesOrderCommandValidator()
    {
        RuleFor(v => v.CustomerName).MaximumLength(256);

        RuleFor(v => v.Remarks).MaximumLength(1024);

        RuleForEach(v => v.OrderLines)
            .NotEmpty()
            .WithMessage("Order lines cannot be empty.")
            .ChildRules(line =>
            {
                line.RuleFor(l => l.BatchNumbers)
                    .NotEmpty()
                    .WithMessage("Batch numbers cannot be empty.");
            });
    }
}
