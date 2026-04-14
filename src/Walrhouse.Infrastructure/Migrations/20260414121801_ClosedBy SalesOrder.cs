using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Walrhouse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ClosedBySalesOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClosedBy",
                table: "SalesOrders",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosedBy",
                table: "SalesOrders");
        }
    }
}
