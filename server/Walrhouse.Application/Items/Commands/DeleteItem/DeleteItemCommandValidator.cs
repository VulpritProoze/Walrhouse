namespace Walrhouse.Application.Items.Commands.DeleteItem;

public class DeleteItemCommandValidator : AbstractValidator<DeleteItemCommand>
{
    public DeleteItemCommandValidator()
    {
        RuleFor(v => v.Id).GreaterThan(0);
    }
}
