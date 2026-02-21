using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class ForumPost
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(10000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
