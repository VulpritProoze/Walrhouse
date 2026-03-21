using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Infrastructure.Data.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
        builder.Property(u => u.MiddleName).HasMaxLength(100);
        builder.Property(u => u.LastName).HasMaxLength(100).IsRequired();

        builder.OwnsOne(
            u => u.Address,
            address =>
            {
                address.Property(a => a.Line1).HasColumnName("AddressLine1").HasMaxLength(200);
                address.Property(a => a.Line2).HasColumnName("AddressLine2").HasMaxLength(200);
                address.Property(a => a.City).HasColumnName("AddressCity").HasMaxLength(100);
                address
                    .Property(a => a.StateOrProvince)
                    .HasColumnName("AddressStateOrProvince")
                    .HasMaxLength(100);
                address
                    .Property(a => a.PostalCode)
                    .HasColumnName("AddressPostalCode")
                    .HasMaxLength(20);
                address.Property(a => a.Country).HasColumnName("AddressCountry").HasMaxLength(100);
            }
        );

        builder.Navigation(u => u.Address).IsRequired(false);
    }
}
