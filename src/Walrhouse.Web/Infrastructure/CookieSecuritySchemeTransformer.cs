using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace Walrhouse.Web.Infrastructure;

internal sealed class CookieSecuritySchemeTransformer(
    IAuthenticationSchemeProvider authenticationSchemeProvider
) : IOpenApiDocumentTransformer
{
    public async Task TransformAsync(
        OpenApiDocument document,
        OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken
    )
    {
        var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
        if (
            authenticationSchemes.Any(authScheme =>
                authScheme.Name == IdentityConstants.ApplicationScheme
            )
        )
        {
            var requirements = new Dictionary<string, IOpenApiSecurityScheme>
            {
                [IdentityConstants.ApplicationScheme] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.ApiKey,
                    In = ParameterLocation.Cookie,
                    Name = ".AspNetCore.Identity.Application",
                    Description = "ASP.NET Identity Cookie-based authentication",
                },
            };

            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes = requirements;
        }
    }
}
