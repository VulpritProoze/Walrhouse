using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.SalesOrders.Commands.CreateSalesOrder;
using Walrhouse.Application.SalesOrders.Commands.DeleteSalesOrder;
using Walrhouse.Application.SalesOrders.Commands.UpdateSalesOrder;
using Walrhouse.Application.SalesOrders.Queries;
using Walrhouse.Application.SalesOrders.Queries.GetSalesOrder;
using Walrhouse.Application.SalesOrders.Queries.GetSalesOrders;
using Walrhouse.Domain.Constants;

namespace Walrhouse.Web.Endpoints;

public class SalesOrder : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder
            .MapPost(CreateSalesOrder, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));

        groupBuilder
            .MapGet(GetSalesOrders, "")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));

        groupBuilder
            .MapGet(GetSalesOrder, "{id}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));

        groupBuilder
            .MapPut(UpdateSalesOrder, "{id}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));

        groupBuilder
            .MapDelete(DeleteSalesOrder, "{id}")
            .RequireAuthorization(policy => policy.RequireRole(Roles.Administrator));
    }

    [EndpointName(nameof(CreateSalesOrder))]
    [EndpointSummary("Create a new sales order; returns the order ID.")]
    public static async Task<Created<int>> CreateSalesOrder(
        ISender sender,
        [FromBody] CreateSalesOrderCommand command
    )
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/SalesOrder/{id}", id);
    }

    [EndpointName(nameof(GetSalesOrders))]
    [EndpointSummary("Get paginated list of sales orders")]
    public static async Task<IResult> GetSalesOrders(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var result = await sender.Send(new GetSalesOrdersQuery(pageNumber, pageSize));
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetSalesOrder))]
    [EndpointSummary("Get a single sales order by ID")]
    public static async Task<
        Results<Ok<SalesOrderDto>, NotFound, BadRequest<string>>
    > GetSalesOrder(ISender sender, string id)
    {
        if (!int.TryParse(id, out var orderId))
        {
            return TypedResults.BadRequest("Invalid Sales Order ID format.");
        }

        var dto = await sender.Send(new GetSalesOrderQuery(orderId));
        return dto is null ? TypedResults.NotFound() : TypedResults.Ok(dto);
    }

    [EndpointName(nameof(UpdateSalesOrder))]
    [EndpointSummary("Update an existing sales order")]
    public static async Task<IResult> UpdateSalesOrder(
        ISender sender,
        int id,
        [FromBody] UpdateSalesOrderCommand command
    )
    {
        if (id != command.Id)
            return TypedResults.BadRequest();

        await sender.Send(command);
        return TypedResults.NoContent();
    }

    [EndpointName(nameof(DeleteSalesOrder))]
    [EndpointSummary("Delete a sales order by ID")]
    public static async Task<Results<NoContent, NotFound>> DeleteSalesOrder(ISender sender, int id)
    {
        await sender.Send(new DeleteSalesOrderCommand(id));
        return TypedResults.NoContent();
    }
}
