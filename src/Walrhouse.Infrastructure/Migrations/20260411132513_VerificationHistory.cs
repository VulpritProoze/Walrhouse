using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Walrhouse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class VerificationHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_Batches_BatchNumber",
                table: "Batches",
                column: "BatchNumber");

            migrationBuilder.CreateTable(
                name: "VerificationHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BatchNumberVerified = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Remarks = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VerificationHistories_Batches_BatchNumberVerified",
                        column: x => x.BatchNumberVerified,
                        principalTable: "Batches",
                        principalColumn: "BatchNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VerificationHistories_BatchNumberVerified",
                table: "VerificationHistories",
                column: "BatchNumberVerified");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VerificationHistories");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Batches_BatchNumber",
                table: "Batches");
        }
    }
}
