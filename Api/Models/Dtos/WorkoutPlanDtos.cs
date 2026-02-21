using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models.Dtos;

public class WorkoutPlanDto
{
    public Guid Id { get; set; }
    public DateTime PlanDate { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public List<WorkoutPlanEntryDto> Entries { get; set; } = new();
}

public class WorkoutPlanEntryDto
{
    public Guid Id { get; set; }
    public Guid ExerciseId { get; set; }
    public string? ExerciseName { get; set; }
    public int? DurationMinutes { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
}

public class CreateWorkoutPlanRequest
{
    public DateTime PlanDate { get; set; }
}

public class CreateWorkoutPlanEntryRequest
{
    public Guid ExerciseId { get; set; }
    public int? DurationMinutes { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
}

public class UpdateWorkoutPlanEntryRequest
{
    public int? DurationMinutes { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
}
