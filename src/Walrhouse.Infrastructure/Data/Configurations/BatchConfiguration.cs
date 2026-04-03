using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class BatchConfiguration : IEntityTypeConfiguration<Batch>
{
    public void Configure(EntityTypeBuilder<Batch> builder)
    {
        builder.Property(b => b.BatchNumber).HasMaxLength(64).IsRequired();
        builder.HasIndex(b => b.BatchNumber).IsUnique();
        builder.Property(b => b.ItemCode).HasMaxLength(64).IsRequired();
        builder.HasIndex(b => b.ItemCode);
        builder.Property(b => b.ExpiryDate).HasColumnType("timestamp with time zone"); // PostgreSQL uses 'timestamp with time zone' (alias: timestamptz)
        builder.Property(b => b.Status).HasMaxLength(64).IsRequired();
        builder.Property(b => b.BinNo).HasMaxLength(64).IsRequired();
        builder.HasIndex(b => b.BinNo);
        builder
            .HasOne(b => b.Bin)
            .WithMany()
            .HasForeignKey(b => b.BinNo)
            .HasPrincipalKey(bi => bi.BinNo)
            .IsRequired();
    }
}
