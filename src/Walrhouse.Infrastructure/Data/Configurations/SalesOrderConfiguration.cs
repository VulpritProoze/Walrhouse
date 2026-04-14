using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class SalesOrderConfiguration : IEntityTypeConfiguration<SalesOrder>
{
    public void Configure(EntityTypeBuilder<SalesOrder> builder)
    {
        builder.Ignore(e => e.OrderLines);
        builder.Property(e => e.OrderLinesJson).HasColumnName("OrderLines");
        builder.Property(e => e.CustomerName).HasMaxLength(256);
        builder.Property(e => e.Status).HasMaxLength(50).HasConversion<string>();
        builder.Property(e => e.ClosedBy).HasMaxLength(256);
        builder.Property(e => e.Remarks).HasMaxLength(1024);
        builder.Property(e => e.DueDate).HasColumnType("timestamp with time zone");
    }
}
