using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class BinConfiguration : IEntityTypeConfiguration<Bin>
{
    public void Configure(EntityTypeBuilder<Bin> builder)
    {
        builder.Property(b => b.BinNo).HasMaxLength(64).IsRequired();
        builder.HasIndex(b => b.BinNo).IsUnique();
        builder.Property(b => b.BinName).HasMaxLength(256).IsRequired();
        builder.Property(b => b.WarehouseCode).HasMaxLength(64).IsRequired();

        builder
            .HasOne(b => b.Warehouse)
            .WithMany()
            .HasForeignKey(b => b.WarehouseCode)
            .HasPrincipalKey(w => w.WarehouseCode)
            .IsRequired();
    }
}
