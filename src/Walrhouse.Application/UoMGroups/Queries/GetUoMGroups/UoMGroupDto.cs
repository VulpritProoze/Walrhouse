using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.UoMGroups.Queries.GetUoMGroups;

public class UoMGroupDto
{
    public int Id { get; set; }
    public string BaseUoM { get; set; } = string.Empty;
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
    public string UoM { get; set; } = string.Empty;
    public int BaseQty { get; set; }
}
