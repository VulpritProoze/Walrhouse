using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Models;
using Walrhouse.Application.Verification.Commands.CreateVerification;
using Walrhouse.Application.Verification.Queries;
using Walrhouse.Application.Verification.Queries.GetVerificationHistories;
using Walrhouse.Application.Verification.Queries.GetVerificationHistoriesByCreator;
using Walrhouse.Application.Verification.Queries.GetVerificationHistory;

namespace Walrhouse.Web.Endpoints;

public class Verification : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateVerification, "").RequireAuthorization();
        groupBuilder.MapGet(GetVerificationHistories, "").RequireAuthorization();
        groupBuilder.MapGet(GetVerificationHistory, "{id:int}").RequireAuthorization();
        groupBuilder
            .MapGet(GetVerificationHistoriesByCreator, "by-creator/{createdBy}")
            .RequireAuthorization();
    }

    public record CreateVerificationRequest(string BatchNumber, string? Remarks);

    [EndpointName(nameof(CreateVerification))]
    [EndpointSummary("Create a new verification history entry.")]
    public static async Task<Results<Created<int>, UnauthorizedHttpResult>> CreateVerification(
        ISender sender,
        IUser user,
        [FromBody] CreateVerificationRequest request,
        CancellationToken cancellationToken
    )
    {
        if (user.Id == null)
        {
            return TypedResults.Unauthorized();
        }

        var command = new CreateVerificationCommand(request.BatchNumber, user.Id, request.Remarks);

        var id = await sender.Send(command, cancellationToken);
        return TypedResults.Created($"/api/Verification/{id}", id);
    }

    [EndpointName(nameof(GetVerificationHistories))]
    [EndpointSummary("Get paginated list of verification histories.")]
    public static async Task<Ok<PaginatedList<VerificationHistoryDto>>> GetVerificationHistories(
        ISender sender,
        [AsParameters] GetVerificationHistoriesQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await sender.Send(query, cancellationToken);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetVerificationHistory))]
    [EndpointSummary("Get a verification history by ID.")]
    public static async Task<Results<Ok<VerificationHistoryDto>, NotFound>> GetVerificationHistory(
        ISender sender,
        int id,
        CancellationToken cancellationToken
    )
    {
        var result = await sender.Send(new GetVerificationHistoryQuery(id), cancellationToken);
        return result is null ? TypedResults.NotFound() : TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetVerificationHistoriesByCreator))]
    [EndpointSummary("Get paginated list of verification histories for a specific creator.")]
    public static async Task<
        Ok<PaginatedList<VerificationHistoryDto>>
    > GetVerificationHistoriesByCreator(
        ISender sender,
        [AsParameters] GetVerificationHistoriesByCreatorQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await sender.Send(query, cancellationToken);
        return TypedResults.Ok(result);
    }
}
