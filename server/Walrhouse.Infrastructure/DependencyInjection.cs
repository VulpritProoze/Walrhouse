using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Domain.Constants;
using Walrhouse.Infrastructure.Data;
using Walrhouse.Infrastructure.Data.Interceptors;
using Walrhouse.Infrastructure.Identity;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        Guard.Against.Null(
            connectionString,
            message: "Configuration string 'ConnectionStrings:DefaultConnection' not found."
        );

        builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        builder.Services.AddDbContext<ApplicationDbContext>(
            (sp, options) =>
            {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                options.UseNpgsql(connectionString);
            }
        );

        builder.Services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>()
        );

        builder.Services.AddScoped<ApplicationDbContextInitializer>();

        var cookieExpiryDays = builder.Configuration.GetValue<int>("CookieExpiryDays");
        Guard.Against.Null(cookieExpiryDays, "Configuration string 'CookieExpiryDays' not found.");

        builder.Services.ConfigureApplicationCookie(options =>
        {
            options.ExpireTimeSpan = TimeSpan.FromDays(cookieExpiryDays);
            options.SlidingExpiration = true;

            if (builder.Environment.IsProduction())
            {
                var domainName = builder.Configuration.GetValue<string>("DomainName");
                Guard.Against.Null(domainName, "Configuration string 'DomainName' not found.");

                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.Domain = domainName;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            }
        });

        builder
            .Services.AddAuthentication(IdentityConstants.ApplicationScheme)
            .AddIdentityCookies();

        builder.Services.AddAuthorizationBuilder();

        builder
            .Services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.SignIn.RequireConfirmedEmail = false;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();

        builder.Services.AddSingleton(TimeProvider.System);
        builder.Services.AddTransient<IIdentityService, IdentityService>();

        builder.Services.AddAuthorization(options =>
            options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator))
        );
    }
}
