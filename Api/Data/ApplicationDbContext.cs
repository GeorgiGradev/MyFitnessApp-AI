using Microsoft.EntityFrameworkCore;
using MyFitnessApp.Api.Models;

namespace MyFitnessApp.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Food> Foods => Set<Food>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<EatingPlan> EatingPlans => Set<EatingPlan>();
    public DbSet<EatingPlanEntry> EatingPlanEntries => Set<EatingPlanEntry>();
    public DbSet<WorkoutPlan> WorkoutPlans => Set<WorkoutPlan>();
    public DbSet<WorkoutPlanEntry> WorkoutPlanEntries => Set<WorkoutPlanEntry>();
    public DbSet<ForumPost> ForumPosts => Set<ForumPost>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<ArticleCategory> ArticleCategories => Set<ArticleCategory>();
    public DbSet<Article> Articles => Set<Article>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.NormalizedEmail).IsUnique();
            entity.HasOne(e => e.Profile)
                  .WithOne(p => p.User)
                  .HasForeignKey<Profile>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
        });

        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name);
        });

        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name);
        });

        modelBuilder.Entity<EatingPlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.PlanDate }).IsUnique();
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<EatingPlanEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.EatingPlan).WithMany(p => p.Entries).HasForeignKey(e => e.EatingPlanId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Food).WithMany().HasForeignKey(e => e.FoodId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<WorkoutPlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.PlanDate }).IsUnique();
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<WorkoutPlanEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.WorkoutPlan).WithMany(p => p.Entries).HasForeignKey(e => e.WorkoutPlanId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Exercise).WithMany().HasForeignKey(e => e.ExerciseId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ForumPost>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CreatedAtUtc);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Post).WithMany(p => p.Comments).HasForeignKey(e => e.PostId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ArticleCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
        });
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Category).WithMany(c => c.Articles).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.Author).WithMany().HasForeignKey(e => e.AuthorUserId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
