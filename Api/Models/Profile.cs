using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class Profile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    [MaxLength(200)]
    public string? DisplayName { get; set; }

    [MaxLength(50)]
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public virtual User User { get; set; } = null!;
}
