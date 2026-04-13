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
                line.RuleFor(l => l.BatchNumbers)
                    .NotEmpty()
                    .WithMessage("Batch numbers cannot be empty.");
            });
    }
}
