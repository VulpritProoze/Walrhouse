namespace Walrhouse.Application.SalesOrders.Queries.GetSalesOrder;

public class GetSalesOrderQueryValidator : AbstractValidator<GetSalesOrderQuery>
{
    public GetSalesOrderQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Id is required.")
            .GreaterThan(-1)
            .WithMessage("Id must be a positive integer.");
    }
}
