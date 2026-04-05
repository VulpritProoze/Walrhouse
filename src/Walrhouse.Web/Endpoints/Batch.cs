using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Batches.Commands.CreateBatch;
using Walrhouse.Application.Batches.Commands.DeleteBatch;
using Walrhouse.Application.Batches.Commands.UpdateBatch;
using Walrhouse.Application.Batches.Queries.GetBatch;
using Walrhouse.Application.Batches.Queries.GetBatches;
using Walrhouse.Domain.Constants;

namespace Walrhouse.Web.Endpoints;

public class Batch : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder
            .MapPost(CreateBatch, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetBatches, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetBatch, "{batchNumber}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapPut(UpdateBatch, "{batchNumber}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapDelete(DeleteBatch, "{batchNumber}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(GetBatches))]
    [EndpointSummary("Get paginated list of batches")]
    public static async Task<IResult> GetBatches(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var query = new GetBatchesQuery(pageNumber, pageSize);
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetBatch))]
    [EndpointSummary("Get a single batch by batch number")]
    public static async Task<Results<Ok<BatchDto>, NotFound>> GetBatch(
        ISender sender,
        string batchNumber
    )
    {
        var dto = await sender.Send(new GetBatchQuery(batchNumber));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(CreateBatch))]
    [EndpointSummary("Create a new batch; returns the batch number.")]
    public static async Task<Created<string>> CreateBatch(
        ISender sender,
        [FromBody] CreateBatchCommand command
    )
    {
        var code = await sender.Send(command);
        return TypedResults.Created($"/api/Batch/{code}", code);
    }

    [EndpointName(nameof(UpdateBatch))]
    [EndpointSummary("Update an existing batch")]
    public static async Task<Results<NoContent, NotFound>> UpdateBatch(
        ISender sender,
        string batchNumber,
        [FromBody] UpdateBatchCommand? command
    )
    {
        var payload = command ?? new UpdateBatchCommand(batchNumber, null, null, null, null);
        var cmd = new UpdateBatchCommand(
            batchNumber,
            payload.ItemCode,
            payload.ExpiryDate,
            payload.Status,
            payload.BinNo
        );

        await sender.Send(cmd);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteBatch))]
    [EndpointSummary("Soft-delete a batch by batch number")]
    public static async Task<Results<NoContent, NotFound>> DeleteBatch(
        ISender sender,
        string batchNumber
    )
    {
        await sender.Send(new DeleteBatchCommand(batchNumber));
        return TypedResults.NoContent();
    }
}
