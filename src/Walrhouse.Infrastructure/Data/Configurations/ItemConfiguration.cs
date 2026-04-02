using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.Property(i => i.ItemCode).HasMaxLength(50).IsRequired();
        builder.Property(i => i.ItemName).HasMaxLength(200);
        builder.Property(i => i.Barcode).HasMaxLength(100);
        builder.Property(i => i.Remarks).HasMaxLength(500);
        builder
            .HasMany(i => i.ItemBarcodes)
            .WithOne(b => b.Item)
            .HasForeignKey(b => b.ItemCode)
            .HasPrincipalKey(i => i.ItemCode)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
