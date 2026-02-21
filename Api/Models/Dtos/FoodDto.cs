using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models.Dtos;

public class FoodDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CaloriesPer100g { get; set; }
    public decimal ProteinPer100g { get; set; }
    public decimal CarbsPer100g { get; set; }
    public decimal FatPer100g { get; set; }
}

public class CreateFoodRequest
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 10000)]
    public decimal CaloriesPer100g { get; set; }

    [Range(0, 1000)]
    public decimal ProteinPer100g { get; set; }

    [Range(0, 1000)]
    public decimal CarbsPer100g { get; set; }

    [Range(0, 1000)]
    public decimal FatPer100g { get; set; }
}
