namespace Walrhouse.Application.BarcodeHistories.Queries.GetBarcodeHistory;

public class GetBarcodeHistoryValidator : AbstractValidator<GetBarcodeHistoryQuery>
{
    public GetBarcodeHistoryValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
    }
}
