using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Walrhouse.ExternalSeeder.Data;
using Walrhouse.ExternalSeeder.Data.Seeders;
using Walrhouse.Infrastructure.Data;

Console.WriteLine("--- Walrhouse External Seeder (.NET 10) ---");

// Load configuration
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile("appsettings.Development.json", optional: true)
    .Build();

var connectionString = configuration.GetConnectionString("ExternalDb");

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Connection string 'ExternalDb' not found in appsettings.json.");
}

var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
optionsBuilder.UseSqlServer(connectionString);

using var context = new ExternalDbContext(optionsBuilder.Options);

Console.WriteLine("[System] Checking database...");
await context.Database.EnsureCreatedAsync();

// Execute modular seeders
await UoMGroupSeeder.SeedAsync(context);
await ItemSeeder.SeedAsync(context);
await BinSeeder.SeedAsync(context);

Console.WriteLine("[System] Seeding process finished.");
