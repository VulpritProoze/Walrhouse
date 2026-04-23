using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Walrhouse.ExternalSeeder.Data;

namespace Walrhouse.ExternalSeeder.Helpers;

internal static class SeederDiscovery
{
    public static List<SeederOption> DiscoverSeeders()
    {
        var seedMethodArgs = new[] { typeof(ExternalDbContext) };

        return Assembly
            .GetExecutingAssembly()
            .GetTypes()
            .Where(t =>
                t.IsClass
                && t.IsAbstract
                && t.IsSealed
                && t.Namespace == "Walrhouse.ExternalSeeder.Data.Seeders"
            )
            .Select(t =>
            {
                var method = t.GetMethod(
                    "SeedAsync",
                    BindingFlags.Public | BindingFlags.Static,
                    binder: null,
                    types: seedMethodArgs,
                    modifiers: null
                );

                if (method == null)
                {
                    return null;
                }

                return new SeederOption(
                    Name: t.Name.EndsWith("Seeder") ? t.Name[..^"Seeder".Length] : t.Name,
                    RunAsync: async dbContext =>
                    {
                        var result = method.Invoke(null, new object[] { dbContext });
                        if (result is Task task)
                        {
                            await task;
                        }
                    }
                );
            })
            .Where(s => s is not null)
            .Select(s => s!)
            .OrderBy(s => s.Name)
            .ToList();
    }
}
