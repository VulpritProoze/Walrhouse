using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Walrhouse.Application.Barcode.Commands.CreateBarcodeHistory;
using Walrhouse.Application.Barcode.Queries;
using Walrhouse.Application.Barcode.Queries.GetBarcodeHistories;
using Walrhouse.Application.Barcode.Queries.GetBarcodeHistory;
using Walrhouse.Application.Common.Interfaces;
using Walrhouse.Application.Common.Models;
using DomainBarcodeFormat = Walrhouse.Domain.Enums.BarcodeFormat;

namespace Walrhouse.Web.Endpoints;

public class BarcodeHistory : IEndpointGroup
{
    public static void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateBarcodeHistory, "").RequireAuthorization();
        groupBuilder.MapGet(GenerateBarcodeImage, "generate/{batchNumber}").AllowAnonymous();
        groupBuilder.MapGet(GetBarcodeHistories, "").RequireAuthorization();
        groupBuilder.MapGet(GetBarcodeHistory, "{id}").RequireAuthorization();
    }

    [EndpointName(nameof(GenerateBarcodeImage))]
    [EndpointSummary("Generate a barcode PNG image for a batch number")]
    public static IResult GenerateBarcodeImage(
        [FromRoute] string batchNumber,
        IBarcodeService barcodeService
    )
    {
        var pngBytes = barcodeService.Encode(batchNumber, DomainBarcodeFormat.GS1_128);

        return TypedResults.File(pngBytes, "image/png");
    }

    [EndpointName(nameof(CreateBarcodeHistory))]
    [EndpointSummary("Create a new barcode history entry")]
    public static async Task<Results<Created<int>, BadRequest>> CreateBarcodeHistory(
        ISender sender,
        IIdentityService identityService,
        [FromBody] CreateBarcodeHistoryCommand command
    )
    {
        if (string.IsNullOrEmpty(command.CreatedBy))
        {
            return TypedResults.BadRequest();
        }

        var (result, identityUser) = await identityService.GetUserByIdAsync(command.CreatedBy);

        if (!result.Succeeded || identityUser == null)
        {
            return TypedResults.BadRequest();
        }

        var id = await sender.Send(command);
        return TypedResults.Created($"/api/BarcodeHistory/{id}", id);
    }

    [EndpointName(nameof(GetBarcodeHistories))]
    [EndpointSummary("Get paginated list of barcode history entries")]
    public static async Task<Ok<PaginatedList<BarcodeHistoryDto>>> GetBarcodeHistories(
        ISender sender,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 100
    )
    {
        var result = await sender.Send(new GetBarcodeHistoriesQuery(pageNumber, pageSize));
        return TypedResults.Ok(result);
    }

    [EndpointName(nameof(GetBarcodeHistory))]
    [EndpointSummary("Get a single barcode history entry by id")]
    public static async Task<Results<Ok<BarcodeHistoryDto>, NotFound>> GetBarcodeHistory(
        ISender sender,
        [FromRoute] int id
    )
    {
        var dto = await sender.Send(new GetBarcodeHistoryQuery(id));
        return TypedResults.Ok(dto);
    }
}
