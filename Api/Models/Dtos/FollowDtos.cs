namespace MyFitnessApp.Api.Models.Dtos;

public class UserListItemDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public bool IsFollowing { get; set; }
}

public class FollowerDto
{
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
}
