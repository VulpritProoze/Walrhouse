namespace Walrhouse.Application.Items.Queries.GetItem;

public class GetItemQueryValidator : AbstractValidator<GetItemQuery>
{
    public GetItemQueryValidator()
    {
        RuleFor(x => x.ItemCode)
            .NotEmpty()
            .WithMessage("ItemCode is required.")
            .MaximumLength(64)
            .WithMessage("ItemCode must be at most 64 characters.");
    }
}
