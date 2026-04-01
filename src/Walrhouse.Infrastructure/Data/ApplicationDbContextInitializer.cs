using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Constants;
using Walrhouse.Domain.Entities;
using Walrhouse.Infrastructure.Identity;

namespace Walrhouse.Infrastructure.Data;

public static class InitializerExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initializer =
            scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();

        await initializer.InitializeAsync();
        await initializer.SeedAsync();
    }
}

public class ApplicationDbContextInitializer
{
    private readonly ILogger<ApplicationDbContextInitializer> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public ApplicationDbContextInitializer(
        ILogger<ApplicationDbContextInitializer> logger,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration
    )
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    public async Task InitializeAsync()
    {
        try
        {
            // In Development, we wipe and recreate the database for rapid iteration
            // See https://jasontaylor.dev/ef-core-database-initialisation-strategies
            await _context.Database.EnsureDeletedAsync();
            await _context.Database.EnsureCreatedAsync();
            // _context.Database.Migrate();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles
        foreach (var roleName in Roles.All)
        {
            if (_roleManager.Roles.All(r => r.Name != roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        var seedUsers = _configuration.GetSection("SeedUsers").Get<Dictionary<string, SeedUser>>();
        Guard.Against.Null(seedUsers, message: "Configuration section 'SeedUsers' not found.");

        foreach (var kv in seedUsers)
        {
            var roleName = kv.Key;
            var u = kv.Value;

            if (await _userManager.FindByNameAsync(u.Email) == null)
            {
                var user = new ApplicationUser
                {
                    UserName = u.Email,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                };

                await _userManager.CreateAsync(user, u.Password);
                if (
                    !string.IsNullOrWhiteSpace(roleName)
                    && await _roleManager.RoleExistsAsync(roleName)
                )
                {
                    await _userManager.AddToRolesAsync(user, new[] { roleName });
                }
            }
        }

        // Default data
        // Seed, if necessary
        if (!_context.Items.Any())
        {
            _context.Items.Add(
                new Item
                {
                    ItemCode = "ITEM-001",
                    ItemName = "Sample Seed Item",
                    ItemGroup = Walrhouse.Domain.Enums.ItemGroup.General,
                    Remarks = "Seeded by ApplicationDbContextInitializer",
                }
            );

            await _context.SaveChangesAsync();
        }
    }
}

public class SeedUser
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}
