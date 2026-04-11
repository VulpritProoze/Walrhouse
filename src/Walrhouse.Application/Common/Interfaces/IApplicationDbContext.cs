using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Item> Items { get; }
    DbSet<Bin> Bins { get; }
    DbSet<Batch> Batches { get; }
    DbSet<Stock> Stocks { get; }
    DbSet<UoMGroup> UoMGroups { get; }
    DbSet<Warehouse> Warehouses { get; }
    DbSet<BarcodeHistory> BarcodeHistories { get; }
    DbSet<VerificationHistory> VerificationHistories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
