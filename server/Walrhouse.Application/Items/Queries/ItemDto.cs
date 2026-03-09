namespace Walrhouse.Application.Items.Queries.GetItems;

public class ItemDto
{
    public int Id { get; init; }
    public string ItemCode { get; init; } = string.Empty;
    public string ItemName { get; init; } = string.Empty;
    public string? Barcode { get; init; }
    public int ItemGroup { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.Item, ItemDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.ItemId));
        }
    }
}
