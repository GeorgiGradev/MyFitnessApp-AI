using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class Food
{
    public Guid Id { get; set; }

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public decimal CaloriesPer100g { get; set; }
    public decimal ProteinPer100g { get; set; }
    public decimal CarbsPer100g { get; set; }
    public decimal FatPer100g { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
