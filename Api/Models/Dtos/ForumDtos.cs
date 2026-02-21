using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models.Dtos;

public class ForumPostDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string? AuthorDisplayName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
    public List<CommentDto> Comments { get; set; } = new();
}

public class ForumPostListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string? AuthorDisplayName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public int CommentCount { get; set; }
}

public class CommentDto
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public string? AuthorDisplayName { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateForumPostRequest
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(10000)]
    public string Content { get; set; } = string.Empty;
}

public class UpdateForumPostRequest
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(10000)]
    public string Content { get; set; } = string.Empty;
}

public class CreateCommentRequest
{
    [Required, MaxLength(5000)]
    public string Content { get; set; } = string.Empty;
}
