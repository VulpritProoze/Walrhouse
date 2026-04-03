using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class StockConfiguration : IEntityTypeConfiguration<Stock>
{
    public void Configure(EntityTypeBuilder<Stock> builder)
    {
        builder.Property(s => s.ItemCode).HasMaxLength(64).IsRequired();
        builder.HasIndex(s => s.ItemCode);
        builder.Property(s => s.QuantityOnHand).IsRequired();
        builder
            .HasOne(s => s.Item)
            .WithMany()
            .HasForeignKey(s => s.ItemCode)
            .HasPrincipalKey(i => i.ItemCode)
            .IsRequired();
    }
}
