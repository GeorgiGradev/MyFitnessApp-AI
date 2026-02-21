namespace MyFitnessApp.Api.Models;

public class UserFollow
{
    public Guid FollowerUserId { get; set; }
    public Guid FollowingUserId { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public virtual User FollowerUser { get; set; } = null!;
    public virtual User FollowingUser { get; set; } = null!;
}
