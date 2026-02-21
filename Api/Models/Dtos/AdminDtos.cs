namespace MyFitnessApp.Api.Models.Dtos;

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public bool IsBanned { get; set; }
    public bool IsAdmin { get; set; }
}
