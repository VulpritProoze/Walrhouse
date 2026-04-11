using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class BarcodeHistoryConfiguration : IEntityTypeConfiguration<BarcodeHistory>
{
    public void Configure(EntityTypeBuilder<BarcodeHistory> builder)
    {
        builder
            .Property(b => b.BarcodeValue)
            .HasMaxLength(256)
            .IsRequired()
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);

        builder
            .Property(b => b.BatchNumber)
            .HasMaxLength(64)
            .IsRequired()
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);

        builder
            .Property(b => b.BarcodeFormat)
            .HasMaxLength(64)
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);

        builder
            .Property(b => b.Remarks)
            .HasMaxLength(1024)
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);

        builder
            .Property(b => b.CreatedAt)
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);

        builder
            .Property(b => b.CreatedBy)
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Throw);

        // No delete logic is usually handled by not exposing the Command,
        // but this Metadata configuration ensures that even if an Update is attempted,
        // EF Core will throw an exception for these immutable properties.
    }
}
