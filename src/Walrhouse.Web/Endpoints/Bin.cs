using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Bins.Commands.CreateBin;
using Walrhouse.Application.Bins.Commands.DeleteBin;
using Walrhouse.Application.Bins.Commands.UpdateBin;
using Walrhouse.Application.Bins.Queries.GetBin;
using Walrhouse.Application.Bins.Queries.GetBins;
using Walrhouse.Domain.Constants;

namespace Walrhouse.Web.Endpoints;

public class Bin : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder
            .MapPost(CreateBin, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetBins, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetBin, "{binNo}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapPut(UpdateBin, "{binNo}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapDelete(DeleteBin, "{binNo}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(GetBins))]
    [EndpointSummary("Get paginated list of bins")]
    public static async Task<IResult> GetBins(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var query = new GetBinsQuery(pageNumber, pageSize);
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetBin))]
    [EndpointSummary("Get a single bin by bin number")]
    public static async Task<Results<Ok<BinDto>, NotFound>> GetBin(ISender sender, string binNo)
    {
        var dto = await sender.Send(new GetBinQuery(binNo));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(CreateBin))]
    [EndpointSummary("Create a new bin; returns the bin number.")]
    public static async Task<Created<string>> CreateBin(
        ISender sender,
        [FromBody] CreateBinCommand command
    )
    {
        var code = await sender.Send(command);
        return TypedResults.Created($"/api/Bin/{code}", code);
    }

    [EndpointName(nameof(UpdateBin))]
    [EndpointSummary("Update an existing bin")]
    public static async Task<Results<NoContent, NotFound>> UpdateBin(
        ISender sender,
        string binNo,
        [FromBody] UpdateBinCommand? command
    )
    {
        var payload = command ?? new UpdateBinCommand(binNo, null, null);
        var cmd = new UpdateBinCommand(binNo, payload.BinName, payload.WarehouseCode);

        await sender.Send(cmd);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteBin))]
    [EndpointSummary("Soft-delete a bin by bin number")]
    public static async Task<Results<NoContent, NotFound>> DeleteBin(ISender sender, string binNo)
    {
        await sender.Send(new DeleteBinCommand(binNo));
        return TypedResults.NoContent();
    }
}
