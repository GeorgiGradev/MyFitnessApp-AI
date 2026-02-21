using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyFitnessApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDiariesForumBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EatingPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EatingPlans", x => x.Id);
                    table.ForeignKey(name: "FK_EatingPlans_Users_UserId", x => x.UserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkoutPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutPlans", x => x.Id);
                    table.ForeignKey(name: "FK_WorkoutPlans_Users_UserId", x => x.UserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArticleCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_ArticleCategories", x => x.Id); });

            migrationBuilder.CreateTable(
                name: "ForumPosts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Content = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ForumPosts", x => x.Id);
                    table.ForeignKey(name: "FK_ForumPosts_Users_UserId", x => x.UserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EatingPlanEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EatingPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    FoodId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuantityGrams = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EatingPlanEntries", x => x.Id);
                    table.ForeignKey(name: "FK_EatingPlanEntries_EatingPlans_EatingPlanId", x => x.EatingPlanId, principalTable: "EatingPlans", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(name: "FK_EatingPlanEntries_Foods_FoodId", x => x.FoodId, principalTable: "Foods", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WorkoutPlanEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkoutPlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    Sets = table.Column<int>(type: "integer", nullable: true),
                    Reps = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutPlanEntries", x => x.Id);
                    table.ForeignKey(name: "FK_WorkoutPlanEntries_WorkoutPlans_WorkoutPlanId", x => x.WorkoutPlanId, principalTable: "WorkoutPlans", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(name: "FK_WorkoutPlanEntries_Exercises_ExerciseId", x => x.ExerciseId, principalTable: "Exercises", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    AuthorUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Content = table.Column<string>(type: "character varying(50000)", maxLength: 50000, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Id);
                    table.ForeignKey(name: "FK_Articles_ArticleCategories_CategoryId", x => x.CategoryId, principalTable: "ArticleCategories", principalColumn: "Id", onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(name: "FK_Articles_Users_AuthorUserId", x => x.AuthorUserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(name: "FK_Comments_ForumPosts_PostId", x => x.PostId, principalTable: "ForumPosts", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(name: "FK_Comments_Users_UserId", x => x.UserId, principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(name: "IX_EatingPlans_UserId_PlanDate", table: "EatingPlans", columns: new[] { "UserId", "PlanDate" }, unique: true);
            migrationBuilder.CreateIndex(name: "IX_EatingPlanEntries_EatingPlanId", table: "EatingPlanEntries", column: "EatingPlanId");
            migrationBuilder.CreateIndex(name: "IX_EatingPlanEntries_FoodId", table: "EatingPlanEntries", column: "FoodId");
            migrationBuilder.CreateIndex(name: "IX_WorkoutPlans_UserId_PlanDate", table: "WorkoutPlans", columns: new[] { "UserId", "PlanDate" }, unique: true);
            migrationBuilder.CreateIndex(name: "IX_WorkoutPlanEntries_WorkoutPlanId", table: "WorkoutPlanEntries", column: "WorkoutPlanId");
            migrationBuilder.CreateIndex(name: "IX_WorkoutPlanEntries_ExerciseId", table: "WorkoutPlanEntries", column: "ExerciseId");
            migrationBuilder.CreateIndex(name: "IX_ArticleCategories_Name", table: "ArticleCategories", column: "Name", unique: true);
            migrationBuilder.CreateIndex(name: "IX_Articles_CategoryId", table: "Articles", column: "CategoryId");
            migrationBuilder.CreateIndex(name: "IX_Articles_AuthorUserId", table: "Articles", column: "AuthorUserId");
            migrationBuilder.CreateIndex(name: "IX_ForumPosts_UserId", table: "ForumPosts", column: "UserId");
            migrationBuilder.CreateIndex(name: "IX_ForumPosts_CreatedAtUtc", table: "ForumPosts", column: "CreatedAtUtc");
            migrationBuilder.CreateIndex(name: "IX_Comments_PostId", table: "Comments", column: "PostId");
            migrationBuilder.CreateIndex(name: "IX_Comments_UserId", table: "Comments", column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Comments");
            migrationBuilder.DropTable(name: "EatingPlanEntries");
            migrationBuilder.DropTable(name: "WorkoutPlanEntries");
            migrationBuilder.DropTable(name: "Articles");
            migrationBuilder.DropTable(name: "ForumPosts");
            migrationBuilder.DropTable(name: "EatingPlans");
            migrationBuilder.DropTable(name: "WorkoutPlans");
            migrationBuilder.DropTable(name: "ArticleCategories");
        }
    }
}
