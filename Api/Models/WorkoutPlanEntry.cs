namespace MyFitnessApp.Api.Models;

public class WorkoutPlanEntry
{
    public Guid Id { get; set; }
    public Guid WorkoutPlanId { get; set; }
    public Guid ExerciseId { get; set; }
    public int? DurationMinutes { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }

    public virtual WorkoutPlan WorkoutPlan { get; set; } = null!;
    public virtual Exercise Exercise { get; set; } = null!;
}
