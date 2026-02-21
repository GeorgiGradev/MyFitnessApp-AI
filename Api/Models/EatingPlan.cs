using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class EatingPlan
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime PlanDate { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual ICollection<EatingPlanEntry> Entries { get; set; } = new List<EatingPlanEntry>();
}
