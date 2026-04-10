using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.UoMGroups.Queries.GetUoMGroups;

public class UoMGroupDto
{
    public int Id { get; set; }
    public UnitOfMeasurement BaseUoM { get; set; }
    public List<UoMGroupLineDto> UoMGroupLines { get; set; } = new();

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<UoMGroup, UoMGroupDto>();
            CreateMap<UoMGroupLine, UoMGroupLineDto>();
        }
    }
}

public class UoMGroupLineDto
{
    public UnitOfMeasurement UoM { get; set; }
    public int BaseQty { get; set; }
}
