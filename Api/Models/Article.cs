using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class Article
{
    public Guid Id { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? AuthorUserId { get; set; }

    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(50000)]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }

    public virtual ArticleCategory? Category { get; set; }
    public virtual User? Author { get; set; }
}
