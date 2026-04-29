using System;
using System.Threading.Tasks;
using Walrhouse.ExternalSeeder.Data;

namespace Walrhouse.ExternalSeeder.Helpers;

internal sealed record SeederOption(string Name, Func<ExternalDbContext, Task> RunAsync);
