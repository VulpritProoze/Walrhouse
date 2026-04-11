using Walrhouse.Domain.Entities;
using Walrhouse.Domain.Enums;

namespace Walrhouse.Application.Items.Queries.GetItems;

public class ItemDto
{
    public string ItemCode { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public int UoMGroupId { get; set; }
    public string? UoMGroupName { get; set; }
    public string? UoMGroupBaseUoM { get; set; }
    public string BarcodeValue { get; set; } = string.Empty;
    public BarcodeFormat? BarcodeFormat { get; set; }
    public ItemGroup? ItemGroup { get; set; }
    public string? Remarks { get; set; }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Item, ItemDto>()
                .ForMember(d => d.UoMGroupName, opt => opt.MapFrom(s => s.UoMGroup.Name))
                .ForMember(d => d.UoMGroupBaseUoM, opt => opt.MapFrom(s => s.UoMGroup.BaseUoM));
        }
    }
}
