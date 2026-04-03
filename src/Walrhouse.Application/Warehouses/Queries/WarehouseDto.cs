using AutoMapper;
using Walrhouse.Application.Common.Mappings;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Warehouses.Queries;

public class WarehouseDto
{
    public string WarehouseCode { get; set; } = string.Empty;
    public string? WarehouseName { get; set; }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Warehouse, WarehouseDto>();
        }
    }
}
