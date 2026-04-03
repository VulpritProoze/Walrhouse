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
    public static void Map(RouteGroupBuilder groupBuilder) { }
}
