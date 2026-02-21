using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFitnessApp.Api.Data;
using MyFitnessApp.Api.Models;
using MyFitnessApp.Api.Models.Dtos;

namespace MyFitnessApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ArticlesController(ApplicationDbContext db) => _db = db;

    private Guid? GetUserId()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleListItemDto>>> GetList(
        [FromQuery] Guid? categoryId,
        [FromQuery] Guid? authorUserId,
        CancellationToken cancellationToken)
    {
        IQueryable<Article> query = _db.Articles.AsNoTracking()
            .Include(a => a.Category)
            .Include(a => a.Author!).ThenInclude(u => u.Profile);
        if (categoryId.HasValue) query = query.Where(a => a.CategoryId == categoryId.Value);
        if (authorUserId.HasValue) query = query.Where(a => a.AuthorUserId == authorUserId.Value);
        var list = await query.OrderByDescending(a => a.CreatedAtUtc).Select(a => new ArticleListItemDto
        {
            Id = a.Id,
            Title = a.Title,
            CategoryId = a.CategoryId,
            CategoryName = a.Category != null ? a.Category.Name : null,
            AuthorDisplayName = a.Author != null && a.Author.Profile != null ? a.Author.Profile.DisplayName : null,
            CreatedAtUtc = a.CreatedAtUtc
        }).ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ArticleDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var article = await _db.Articles.AsNoTracking()
            .Include(a => a.Category)
            .Include(a => a.Author!).ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (article == null) return NotFound();
        return Ok(new ArticleDto
        {
            Id = article.Id,
            Title = article.Title,
            Content = article.Content,
            CategoryId = article.CategoryId,
            CategoryName = article.Category?.Name,
            AuthorUserId = article.AuthorUserId,
            AuthorDisplayName = article.Author?.Profile?.DisplayName,
            CreatedAtUtc = article.CreatedAtUtc,
            UpdatedAtUtc = article.UpdatedAtUtc
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ArticleDto>> Create([FromBody] CreateArticleRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var article = new Article
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            CategoryId = request.CategoryId,
            AuthorUserId = userId.Value,
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.Articles.Add(article);
        await _db.SaveChangesAsync(cancellationToken);
        var loaded = await _db.Articles.AsNoTracking().Include(a => a.Category).Include(a => a.Author!).ThenInclude(u => u.Profile).FirstAsync(a => a.Id == article.Id, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = article.Id }, new ArticleDto
        {
            Id = loaded.Id,
            Title = loaded.Title,
            Content = loaded.Content,
            CategoryId = loaded.CategoryId,
            CategoryName = loaded.Category?.Name,
            AuthorUserId = loaded.AuthorUserId,
            AuthorDisplayName = loaded.Author?.Profile?.DisplayName,
            CreatedAtUtc = loaded.CreatedAtUtc,
            UpdatedAtUtc = loaded.UpdatedAtUtc
        });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ArticleDto>> Update(Guid id, [FromBody] UpdateArticleRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (article == null) return NotFound();
        if (article.AuthorUserId != userId.Value) return Forbid();
        article.Title = request.Title.Trim();
        article.Content = request.Content.Trim();
        article.CategoryId = request.CategoryId;
        article.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        var loaded = await _db.Articles.AsNoTracking().Include(a => a.Category).Include(a => a.Author!).ThenInclude(u => u.Profile).FirstAsync(a => a.Id == id, cancellationToken);
        return Ok(new ArticleDto
        {
            Id = loaded.Id,
            Title = loaded.Title,
            Content = loaded.Content,
            CategoryId = loaded.CategoryId,
            CategoryName = loaded.Category?.Name,
            AuthorUserId = loaded.AuthorUserId,
            AuthorDisplayName = loaded.Author?.Profile?.DisplayName,
            CreatedAtUtc = loaded.CreatedAtUtc,
            UpdatedAtUtc = loaded.UpdatedAtUtc
        });
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (article == null) return NotFound();
        if (article.AuthorUserId != userId.Value && !User.IsInRole("Admin")) return Forbid();
        _db.Articles.Remove(article);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
