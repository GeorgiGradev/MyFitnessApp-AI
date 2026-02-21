using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFitnessApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFollows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserFollows",
                columns: table => new
                {
                    FollowerUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    FollowingUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFollows", x => new { x.FollowerUserId, x.FollowingUserId });
                    table.ForeignKey(name: "FK_UserFollows_Users_FollowerUserId", x => x.FollowerUserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(name: "FK_UserFollows_Users_FollowingUserId", x => x.FollowingUserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(name: "IX_UserFollows_FollowerUserId_FollowingUserId", table: "UserFollows", columns: new[] { "FollowerUserId", "FollowingUserId" }, unique: true);
            migrationBuilder.CreateIndex(name: "IX_UserFollows_FollowingUserId", table: "UserFollows", column: "FollowingUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "UserFollows");
        }
    }
}
