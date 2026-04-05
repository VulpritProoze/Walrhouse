using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Common.Models;
using Walrhouse.Application.Items.Commands.CreateItem;
using Walrhouse.Application.Items.Commands.DeleteItem;
using Walrhouse.Application.Items.Commands.UpdateItem;
using Walrhouse.Application.Items.Queries.GetItem;
using Walrhouse.Application.Items.Queries.GetItems;

namespace Walrhouse.Web.Endpoints;

public class Items : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateItem, "").RequireAuthorization();
        groupBuilder.MapGet(GetItems, "").RequireAuthorization();
        groupBuilder.MapGet(GetItem, "{itemCode}").RequireAuthorization();
        groupBuilder.MapPut(UpdateItem, "{itemCode}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteItem, "{itemCode}").RequireAuthorization();
    }

    [EndpointName(nameof(CreateItem))]
    [EndpointSummary("Create a new item; returns the item code.")]
    public static async Task<Created<string>> CreateItem(
        ISender sender,
        [FromBody] CreateItemCommand command
    )
    {
        var code = await sender.Send(command);
        return TypedResults.Created($"/api/Items/{code}", code);
    }

    [EndpointName(nameof(GetItems))]
    [EndpointSummary("Get paginated list of items")]
    public static async Task<IResult> GetItems(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var query = new GetItemsQuery(pageNumber, pageSize);
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetItem))]
    [EndpointSummary("Get a single item by code")]
    public static async Task<Results<Ok<ItemDto>, NotFound>> GetItem(
        ISender sender,
        string itemCode
    )
    {
        var dto = await sender.Send(new GetItemQuery(itemCode));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(UpdateItem))]
    [EndpointSummary("Update an existing item")]
    public static async Task<Results<NoContent, NotFound>> UpdateItem(
        ISender sender,
        string itemCode,
        [FromBody] UpdateItemCommand? command
    )
    {
        var payload = command ?? new UpdateItemCommand(itemCode, null, null, null, null, null);
        var cmd = new UpdateItemCommand(
            itemCode,
            payload.ItemName,
            payload.UgpEntry,
            payload.BarcodeValue,
            payload.BarcodeFormat,
            payload.ItemGroup,
            payload.Remarks
        );

        await sender.Send(cmd);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteItem))]
    [EndpointSummary("Soft-delete an item by code")]
    public static async Task<Results<NoContent, NotFound>> DeleteItem(
        ISender sender,
        string itemCode
    )
    {
        await sender.Send(new DeleteItemCommand(itemCode));
        return TypedResults.NoContent();
    }
}
