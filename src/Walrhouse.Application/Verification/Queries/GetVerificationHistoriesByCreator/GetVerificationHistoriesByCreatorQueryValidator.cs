namespace Walrhouse.Application.Verification.Queries.GetVerificationHistoriesByCreator;

public class GetVerificationHistoriesByCreatorQueryValidator
    : AbstractValidator<GetVerificationHistoriesByCreatorQuery>
{
    public GetVerificationHistoriesByCreatorQueryValidator()
    {
        RuleFor(x => x.CreatedBy).NotEmpty().WithMessage("CreatedBy is required.");
    }
}
