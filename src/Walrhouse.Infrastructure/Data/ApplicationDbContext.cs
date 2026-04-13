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
    public DbSet<Bin> Bins => Set<Bin>();
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<UoMGroup> UoMGroups => Set<UoMGroup>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<BarcodeHistory> BarcodeHistories => Set<BarcodeHistory>();
    public DbSet<VerificationHistory> VerificationHistories => Set<VerificationHistory>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Ignore(typeof(UoMGroupLine));
        builder.Ignore(typeof(OrderLine));
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
