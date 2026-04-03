using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FirstName).HasMaxLength(128).IsRequired();
        builder.Property(u => u.MiddleName).HasMaxLength(128);
        builder.Property(u => u.LastName).HasMaxLength(128).IsRequired();

        builder.OwnsOne(
            u => u.Address,
            address =>
            {
                address.Property(a => a.Line1).HasColumnName("AddressLine1").HasMaxLength(256);
                address.Property(a => a.Line2).HasColumnName("AddressLine2").HasMaxLength(256);
                address.Property(a => a.City).HasColumnName("AddressCity").HasMaxLength(128);
                address
                    .Property(a => a.StateOrProvince)
                    .HasColumnName("AddressStateOrProvince")
                    .HasMaxLength(128);
                address
                    .Property(a => a.PostalCode)
                    .HasColumnName("AddressPostalCode")
                    .HasMaxLength(32);
                address.Property(a => a.Country).HasColumnName("AddressCountry").HasMaxLength(128);
            }
        );

        builder.Navigation(u => u.Address).IsRequired(false);
    }
}
