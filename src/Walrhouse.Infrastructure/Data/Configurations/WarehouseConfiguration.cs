using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
{
    public void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        builder.Property(w => w.WarehouseCode).HasMaxLength(64).IsRequired();
        builder.HasIndex(w => w.WarehouseCode).IsUnique();
        builder.Property(w => w.WarehouseName).HasMaxLength(256);
    }
}
