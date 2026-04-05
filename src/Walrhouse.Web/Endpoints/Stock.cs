using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Stocks.Commands.CreateStock;
using Walrhouse.Application.Stocks.Commands.DeleteStock;
using Walrhouse.Application.Stocks.Commands.UpdateStock;
using Walrhouse.Application.Stocks.Queries.GetStock;
using Walrhouse.Application.Stocks.Queries.GetStocks;
using Walrhouse.Domain.Constants;

namespace Walrhouse.Web.Endpoints;

public class Stock : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder
            .MapPost(CreateStock, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetStocks, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapGet(GetStock, "{itemCode}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapPut(UpdateStock, "{itemCode}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
        groupBuilder
            .MapDelete(DeleteStock, "{itemCode}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(CreateStock))]
    [EndpointSummary("Create a new stock record; returns the item code.")]
    public static async Task<Created<string>> CreateStock(
        ISender sender,
        [FromBody] CreateStockCommand command
    )
    {
        var itemCode = await sender.Send(command);
        return TypedResults.Created($"/api/Stock/{itemCode}", itemCode);
    }

    [EndpointName(nameof(GetStocks))]
    [EndpointSummary("Get paginated list of stock records")]
    public static async Task<IResult> GetStocks(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var query = new GetStocksQuery(pageNumber, pageSize);
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetStock))]
    [EndpointSummary("Get a single stock record by item code")]
    public static async Task<Results<Ok<StockDto>, NotFound>> GetStock(
        ISender sender,
        string itemCode
    )
    {
        var dto = await sender.Send(new GetStockQuery(itemCode));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(UpdateStock))]
    [EndpointSummary("Update an existing stock record")]
    public static async Task<Results<NoContent, NotFound>> UpdateStock(
        ISender sender,
        string itemCode,
        [FromBody] UpdateStockCommand? command
    )
    {
        var payload = command ?? new UpdateStockCommand(itemCode, null);
        var cmd = new UpdateStockCommand(itemCode, payload.QuantityOnHand);

        await sender.Send(cmd);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteStock))]
    [EndpointSummary("Soft-delete a stock record by item code")]
    public static async Task<Results<NoContent, NotFound>> DeleteStock(
        ISender sender,
        string itemCode
    )
    {
        await sender.Send(new DeleteStockCommand(itemCode));
        return TypedResults.NoContent();
    }
}
