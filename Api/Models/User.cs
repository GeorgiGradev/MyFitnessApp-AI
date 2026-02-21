using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class User
{
    public Guid Id { get; set; }

    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(256)]
    public string NormalizedEmail { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public bool IsBanned { get; set; }
    public bool IsAdmin { get; set; }

    public virtual Profile? Profile { get; set; }
}
