using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models.Dtos;

public class EatingPlanDto
{
    public Guid Id { get; set; }
    public DateTime PlanDate { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public List<EatingPlanEntryDto> Entries { get; set; } = new();
}

public class EatingPlanEntryDto
{
    public Guid Id { get; set; }
    public Guid FoodId { get; set; }
    public string? FoodName { get; set; }
    public decimal QuantityGrams { get; set; }
}

public class CreateEatingPlanRequest
{
    public DateTime PlanDate { get; set; }
}

public class CreateEatingPlanEntryRequest
{
    public Guid FoodId { get; set; }

    [Range(0.01, 10000)]
    public decimal QuantityGrams { get; set; }
}

public class UpdateEatingPlanEntryRequest
{
    [Range(0.01, 10000)]
    public decimal QuantityGrams { get; set; }
}
