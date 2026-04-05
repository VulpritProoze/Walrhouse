using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Warehouses.Commands.CreateWarehouse;
using Walrhouse.Application.Warehouses.Commands.DeleteWarehouse;
using Walrhouse.Application.Warehouses.Commands.UpdateWarehouse;
using Walrhouse.Application.Warehouses.Queries.GetWarehouse;
using Walrhouse.Application.Warehouses.Queries.GetWarehouses;
using Walrhouse.Domain.Constants;

namespace Walrhouse.Web.Endpoints;

public class Warehouse : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder
            .MapPost(CreateWarehouse, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetWarehouses, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetWarehouse, "{warehouseCode}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapPut(UpdateWarehouse, "{warehouseCode}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapDelete(DeleteWarehouse, "{warehouseCode}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(CreateWarehouse))]
    [EndpointSummary("Create a new warehouse; returns the warehouse code.")]
    public static async Task<Created<string>> CreateWarehouse(
        ISender sender,
        [FromBody] CreateWarehouseCommand command
    )
    {
        var code = await sender.Send(command);
        return TypedResults.Created($"/api/Warehouses/{code}", code);
    }

    [EndpointName(nameof(GetWarehouses))]
    [EndpointSummary("Get paginated list of warehouses")]
    public static async Task<IResult> GetWarehouses(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var query = new GetWarehousesQuery(pageNumber, pageSize);
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetWarehouse))]
    [EndpointSummary("Get a single warehouse by code")]
    public static async Task<Results<Ok<WarehouseDto>, NotFound>> GetWarehouse(
        ISender sender,
        string warehouseCode
    )
    {
        var dto = await sender.Send(new GetWarehouseQuery(warehouseCode));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(UpdateWarehouse))]
    [EndpointSummary("Update an existing warehouse")]
    public static async Task<Results<NoContent, NotFound>> UpdateWarehouse(
        ISender sender,
        string warehouseCode,
        [FromBody] UpdateWarehouseCommand? command
    )
    {
        var payload = command ?? new UpdateWarehouseCommand(warehouseCode, null);
        var cmd = new UpdateWarehouseCommand(warehouseCode, payload.WarehouseName);

        await sender.Send(cmd);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteWarehouse))]
    [EndpointSummary("Soft-delete a warehouse by code")]
    public static async Task<Results<NoContent, NotFound>> DeleteWarehouse(
        ISender sender,
        string warehouseCode
    )
    {
        await sender.Send(new DeleteWarehouseCommand(warehouseCode));
        return TypedResults.NoContent();
    }
}
