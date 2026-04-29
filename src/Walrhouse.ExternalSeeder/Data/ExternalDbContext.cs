using Microsoft.EntityFrameworkCore;
using Walrhouse.Infrastructure.Data;

namespace Walrhouse.ExternalSeeder.Data;

public class ExternalDbContext(DbContextOptions<ApplicationDbContext> options)
    : ApplicationDbContext(options) { }
