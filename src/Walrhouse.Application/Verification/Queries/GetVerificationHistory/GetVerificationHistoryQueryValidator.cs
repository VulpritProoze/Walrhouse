namespace Walrhouse.Application.Verification.Queries.GetVerificationHistory;

public class GetVerificationHistoryQueryValidator : AbstractValidator<GetVerificationHistoryQuery>
{
    public GetVerificationHistoryQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(-1)
            .WithMessage("Id must be a non-negative integer.")
            .NotEmpty()
            .WithMessage("Id is required.");
    }
}
