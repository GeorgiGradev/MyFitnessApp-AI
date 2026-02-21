using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class WorkoutPlan
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime PlanDate { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual ICollection<WorkoutPlanEntry> Entries { get; set; } = new List<WorkoutPlanEntry>();
}
