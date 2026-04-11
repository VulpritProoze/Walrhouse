using Walrhouse.Application.Common.Mappings;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Verification.Queries;

public class VerificationHistoryDto
{
    public int Id { get; set; }
    public required string BatchNumberVerified { get; set; }
    public string? Remarks { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? CreatedBy { get; set; }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<VerificationHistory, VerificationHistoryDto>();
        }
    }
}
