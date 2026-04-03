using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.Property(i => i.ItemCode).HasMaxLength(64).IsRequired();
        builder.Property(i => i.ItemName).HasMaxLength(256);
        builder.Property(i => i.Remarks).HasMaxLength(1024);
        builder.Property(i => i.ItemGroup).HasMaxLength(128);
        builder.Property(i => i.UgpEntry).HasMaxLength(64).IsRequired();
        builder
            .HasOne(i => i.UoMGroup)
            .WithMany()
            .HasForeignKey(i => i.UgpEntry)
            .HasPrincipalKey(u => u.UgpEntry)
            .IsRequired();
        builder.Property(i => i.BarcodeValue).HasMaxLength(256).IsRequired();
        builder.Property(i => i.BarcodeFormat).HasMaxLength(64);
    }
}
