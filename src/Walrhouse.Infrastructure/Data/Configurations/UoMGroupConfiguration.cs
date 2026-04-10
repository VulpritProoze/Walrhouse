using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Domain.Entities;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class UoMGroupConfiguration : IEntityTypeConfiguration<UoMGroup>
{
    public void Configure(EntityTypeBuilder<UoMGroup> builder)
    {
        builder
            .Property(g => g.UoMGroupLinesJson)
            .HasColumnName("UoMGroupLines")
            .HasColumnType("jsonb");
    }
}
