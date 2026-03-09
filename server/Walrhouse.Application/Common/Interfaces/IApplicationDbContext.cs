using Walrhouse.Domain.Entities;

namespace Walrhouse.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Item> Items { get; }
    DbSet<ItemBarcode> ItemBarcodes { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
