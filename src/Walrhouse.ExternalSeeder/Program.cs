using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Walrhouse.ExternalSeeder.Data;
using Walrhouse.ExternalSeeder.Helpers;
using Walrhouse.Infrastructure.Data;

Console.WriteLine("--- Walrhouse External Seeder (.NET 10) ---");

// Load configuration
var configuration = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile("appsettings.Development.json", optional: true)
    .Build();

var connectionString = configuration.GetConnectionString("ExternalDb");

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Connection string 'ExternalDb' not found in appsettings.json.");
}

var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
optionsBuilder.UseNpgsql(
    connectionString,
    npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null
        );
        npgsqlOptions.CommandTimeout(60);
    }
);

using var context = new ExternalDbContext(optionsBuilder.Options);

Console.WriteLine("[System] Checking database...");
await context.Database.CanConnectAsync();

var seeders = SeederDiscovery.DiscoverSeeders();
if (seeders.Count == 0)
{
    Console.WriteLine("[System] No seeders were discovered.");
    return;
}

var selectedIndex = 0;
while (true)
{
    ConsoleMenu.RenderMenu(seeders, selectedIndex);
    var key = Console.ReadKey(intercept: true).Key;

    if (key == ConsoleKey.UpArrow)
    {
        selectedIndex = selectedIndex == 0 ? seeders.Count + 1 : selectedIndex - 1;
        continue;
    }

    if (key == ConsoleKey.DownArrow)
    {
        selectedIndex = selectedIndex == seeders.Count + 1 ? 0 : selectedIndex + 1;
        continue;
    }

    if (key != ConsoleKey.Enter)
    {
        continue;
    }

    if (selectedIndex == seeders.Count + 1)
    {
        Console.WriteLine("\n[System] Exiting seeder.");
        break;
    }

    Console.WriteLine();
    try
    {
        if (selectedIndex == seeders.Count)
        {
            Console.WriteLine("[System] Running all discovered seeders...");
            foreach (var seeder in seeders)
            {
                Console.WriteLine($"[System] Running {seeder.Name}...");
                await seeder.RunAsync(context);
            }
        }
        else
        {
            var seeder = seeders[selectedIndex];
            Console.WriteLine($"[System] Running {seeder.Name}...");
            await seeder.RunAsync(context);
        }

        Console.WriteLine("[System] Done. Press any key to return to menu...");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Error] Seeding failed: {ex.Message}");
        Console.WriteLine("[System] Press any key to return to menu...");
    }

    Console.ReadKey(intercept: true);
}

// Helpers moved to src/Walrhouse.ExternalSeeder/Helpers
