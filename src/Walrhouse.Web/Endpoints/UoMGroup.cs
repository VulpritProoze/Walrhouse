using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.UoMGroups.Commands.CreateUoMGroup;
using Walrhouse.Application.UoMGroups.Commands.DeleteUoMGroup;
using Walrhouse.Application.UoMGroups.Commands.UpdateUoMGroup;
using Walrhouse.Application.UoMGroups.Queries.GetUoMGroup;
using Walrhouse.Application.UoMGroups.Queries.GetUoMGroups;

namespace Walrhouse.Web.Endpoints;

public class UoMGroup : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateUoMGroup, "").RequireAuthorization();
        groupBuilder.MapGet(GetUoMGroups, "").RequireAuthorization();
        groupBuilder.MapGet(GetUoMGroup, "{ugpEntry}").RequireAuthorization();
        groupBuilder.MapPut(UpdateUoMGroup, "{ugpEntry}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteUoMGroup, "{ugpEntry}").RequireAuthorization();
    }

    [EndpointName(nameof(CreateUoMGroup))]
    [EndpointSummary("Create a new UoM group; returns the group code.")]
    public static async Task<Created<string>> CreateUoMGroup(
        ISender sender,
        [FromBody] CreateUoMGroupCommand command
    )
    {
        var code = await sender.Send(command);
        return TypedResults.Created($"/api/UoMGroups/{code}", code);
    }

    [EndpointName(nameof(GetUoMGroups))]
    [EndpointSummary("Get paginated list of UoM groups")]
    public static async Task<IResult> GetUoMGroups(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var query = new GetUoMGroupsQuery(pageNumber, pageSize);
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetUoMGroup))]
    [EndpointSummary("Get a single UoM group by code")]
    public static async Task<Results<Ok<UoMGroupDto>, NotFound>> GetUoMGroup(
        ISender sender,
        string ugpEntry
    )
    {
        var dto = await sender.Send(new GetUoMGroupQuery(ugpEntry));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(UpdateUoMGroup))]
    [EndpointSummary("Update an existing UoM group")]
    public static async Task<Results<NoContent, NotFound>> UpdateUoMGroup(
        ISender sender,
        string ugpEntry,
        [FromBody] UpdateUoMGroupCommand? command
    )
    {
        var payload = command ?? new UpdateUoMGroupCommand(ugpEntry, null, null);
        var cmd = new UpdateUoMGroupCommand(ugpEntry, payload.BaseUoM, payload.UoMGroupLines);

        await sender.Send(cmd);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteUoMGroup))]
    [EndpointSummary("Soft-delete a UoM group by code")]
    public static async Task<Results<NoContent, NotFound>> DeleteUoMGroup(
        ISender sender,
        string ugpEntry
    )
    {
        await sender.Send(new DeleteUoMGroupCommand(ugpEntry));
        return TypedResults.NoContent();
    }
}
