using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class VerificationHistoryConfiguration : IEntityTypeConfiguration<VerificationHistory>
{
    public void Configure(EntityTypeBuilder<VerificationHistory> builder)
    {
        builder
            .Property(b => b.BatchNumberVerified)
            .HasMaxLength(64)
            .IsRequired()
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

        builder
            .HasOne(v => v.Batch)
            .WithMany()
            .HasForeignKey(v => v.BatchNumberVerified)
            .HasPrincipalKey(b => b.BatchNumber)
            .IsRequired();
    }
}
