using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class Comment
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }

    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public virtual ForumPost Post { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
