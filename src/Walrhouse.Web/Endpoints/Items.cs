using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Common.Models;
using Walrhouse.Application.Items.Commands.CreateItem;
using Walrhouse.Application.Items.Commands.DeleteItem;
using Walrhouse.Application.Items.Commands.PurgeItem;
using Walrhouse.Application.Items.Commands.UpdateItem;
using Walrhouse.Application.Items.Queries.GetItems;

namespace Walrhouse.Web.Endpoints;

public class Items : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetItems);
        groupBuilder.MapPost(CreateItem);
        groupBuilder.MapPut(UpdateItem, "{itemCode}");
        groupBuilder.MapDelete(DeleteItem, "{itemCode}");
        groupBuilder.MapDelete(PurgeItems, "purge");
    }

    [EndpointName(nameof(GetItems))]
    [EndpointSummary("Get items")]
    [EndpointDescription("Returns paginated items.")]
    public static async Task<Ok<PaginatedList<ItemDto>>> GetItems(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var result = await sender.Send(new GetItemsQuery(pageNumber, pageSize));

        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(CreateItem))]
    [EndpointSummary("Create item")]
    [EndpointDescription("Creates an item and returns its code.")]
    public static async Task<Created<string>> CreateItem(ISender sender, CreateItemCommand command)
    {
        var itemCode = await sender.Send(command);

        return TypedResults.Created($"/api/Items/{itemCode}", itemCode);
    }

    [EndpointName(nameof(UpdateItem))]
    [EndpointSummary("Update item")]
    [EndpointDescription("Updates an existing item by code.")]
    public static async Task<Results<NoContent, BadRequest>> UpdateItem(
        ISender sender,
        [FromRoute] string itemCode,
        UpdateItemCommand command
    )
    {
        if (itemCode != command.ItemCode)
        {
            return TypedResults.BadRequest();
        }

        await sender.Send(command);

        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteItem))]
    [EndpointSummary("Delete item")]
    [EndpointDescription("Deletes an existing item by code.")]
    public static async Task<NoContent> DeleteItem(ISender sender, [FromRoute] string itemCode)
    {
        await sender.Send(new DeleteItemCommand(itemCode));

        return TypedResults.NoContent();
    }

    [EndpointName(nameof(PurgeItems))]
    [EndpointSummary("Purge items")]
    [EndpointDescription("Permanently deletes all items.")]
    public static async Task<Ok<int>> PurgeItems(ISender sender)
    {
        var deletedCount = await sender.Send(new PurgeItemsCommand());

        return TypedResults.Ok(deletedCount);
    }
}
