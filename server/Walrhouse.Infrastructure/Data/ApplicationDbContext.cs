using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Entities;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Item> Items => Set<Item>();

    public DbSet<ItemBarcode> ItemBarcodes => Set<ItemBarcode>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
