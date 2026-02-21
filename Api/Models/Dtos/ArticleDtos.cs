using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models.Dtos;

public class ArticleCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ArticleDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public Guid? AuthorUserId { get; set; }
    public string? AuthorDisplayName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}

public class ArticleListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? AuthorDisplayName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateArticleCategoryRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

public class CreateArticleRequest
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(50000)]
    public string Content { get; set; } = string.Empty;

    public Guid? CategoryId { get; set; }
}

public class UpdateArticleRequest
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(50000)]
    public string Content { get; set; } = string.Empty;

    public Guid? CategoryId { get; set; }
}
