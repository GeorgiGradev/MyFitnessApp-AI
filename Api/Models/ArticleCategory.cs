using System.ComponentModel.DataAnnotations;

namespace MyFitnessApp.Api.Models;

public class ArticleCategory
{
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
}
