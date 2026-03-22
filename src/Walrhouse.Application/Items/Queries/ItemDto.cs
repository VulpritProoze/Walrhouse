using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Items.Queries.GetItems;

public class ItemDto
{
    public string ItemCode { get; init; } = string.Empty;
    public string ItemName { get; init; } = string.Empty;
    public string? Barcode { get; init; }
    public int ItemGroup { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Item, ItemDto>();
        }
    }
}
