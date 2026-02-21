namespace MyFitnessApp.Api.Models.Dtos;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    /// <summary>True when user has completed profile (e.g. DisplayName set).</summary>
    public bool HasProfile { get; set; }
}
