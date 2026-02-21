namespace MyFitnessApp.Api.Models;

public class EatingPlanEntry
{
    public Guid Id { get; set; }
    public Guid EatingPlanId { get; set; }
    public Guid FoodId { get; set; }
    public decimal QuantityGrams { get; set; }

    public virtual EatingPlan EatingPlan { get; set; } = null!;
    public virtual Food Food { get; set; } = null!;
}
