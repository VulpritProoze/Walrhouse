using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class ItemBarcodeConfiguration : IEntityTypeConfiguration<ItemBarcode>
{
    public void Configure(EntityTypeBuilder<ItemBarcode> builder)
    {
        builder.Property(ib => ib.Barcode).HasMaxLength(100).IsRequired();
        builder.Property(ib => ib.BarcodeType).HasMaxLength(50);
        builder.Property(ib => ib.UnitOfMeasure).HasMaxLength(20);
        builder
            .HasOne(ib => ib.Item)
            .WithMany(i => i.ItemBarcodes)
            .HasForeignKey(ib => ib.ItemCode)
            .HasPrincipalKey(i => i.ItemCode)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
