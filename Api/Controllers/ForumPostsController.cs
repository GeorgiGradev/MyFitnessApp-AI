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
[Authorize]
public class ForumPostsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ForumPostsController(ApplicationDbContext db) => _db = db;

    private Guid? GetUserId()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ForumPostListItemDto>>> GetList([FromQuery] string? search, CancellationToken cancellationToken)
    {
        IQueryable<ForumPost> query = _db.ForumPosts.AsNoTracking().Include(p => p.User).ThenInclude(u => u.Profile);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Title.ToLower().Contains(search.Trim().ToLower()) || p.Content.ToLower().Contains(search.Trim().ToLower()));
        var list = await query.OrderByDescending(p => p.CreatedAtUtc).Select(p => new ForumPostListItemDto
        {
            Id = p.Id,
            Title = p.Title,
            UserId = p.UserId,
            AuthorDisplayName = p.User.Profile != null ? p.User.Profile.DisplayName : null,
            CreatedAtUtc = p.CreatedAtUtc,
            CommentCount = p.Comments.Count
        }).ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ForumPostDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var post = await _db.ForumPosts.AsNoTracking()
            .Include(p => p.User).ThenInclude(u => u.Profile)
            .Include(p => p.Comments).ThenInclude(c => c.User).ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (post == null) return NotFound();
        return Ok(MapToDto(post));
    }

    [HttpPost]
    public async Task<ActionResult<ForumPostDto>> Create([FromBody] CreateForumPostRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var post = new ForumPost
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.ForumPosts.Add(post);
        await _db.SaveChangesAsync(cancellationToken);
        var loaded = await _db.ForumPosts.AsNoTracking().Include(p => p.User).ThenInclude(u => u.Profile).FirstAsync(p => p.Id == post.Id, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, MapToDto(loaded));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ForumPostDto>> Update(Guid id, [FromBody] UpdateForumPostRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var post = await _db.ForumPosts.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (post == null) return NotFound();
        post.Title = request.Title.Trim();
        post.Content = request.Content.Trim();
        post.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        var loaded = await _db.ForumPosts.AsNoTracking().Include(p => p.User).ThenInclude(u => u.Profile).Include(p => p.Comments).ThenInclude(c => c.User).ThenInclude(u => u.Profile).FirstAsync(p => p.Id == id, cancellationToken);
        return Ok(MapToDto(loaded));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var post = await _db.ForumPosts.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (post == null) return NotFound();
        _db.ForumPosts.Remove(post);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{postId:guid}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid postId, [FromBody] CreateCommentRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var post = await _db.ForumPosts.FindAsync(new object[] { postId }, cancellationToken);
        if (post == null) return NotFound();
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId.Value,
            Content = request.Content.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.Comments.Add(comment);
        await _db.SaveChangesAsync(cancellationToken);
        var user = await _db.Users.AsNoTracking().Include(u => u.Profile).FirstAsync(u => u.Id == userId.Value, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = postId }, new CommentDto
        {
            Id = comment.Id,
            PostId = postId,
            UserId = userId.Value,
            AuthorDisplayName = user.Profile?.DisplayName,
            Content = comment.Content,
            CreatedAtUtc = comment.CreatedAtUtc
        });
    }

    [HttpDelete("{postId:guid}/comments/{commentId:guid}")]
    public async Task<ActionResult> DeleteComment(Guid postId, Guid commentId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId, cancellationToken);
        if (comment == null) return NotFound();
        if (comment.UserId != userId.Value) return Forbid();
        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static ForumPostDto MapToDto(ForumPost p) => new()
    {
        Id = p.Id,
        Title = p.Title,
        Content = p.Content,
        UserId = p.UserId,
        AuthorDisplayName = p.User?.Profile?.DisplayName,
        CreatedAtUtc = p.CreatedAtUtc,
        UpdatedAtUtc = p.UpdatedAtUtc,
        Comments = (p.Comments ?? new List<Comment>()).Select(c => new CommentDto
        {
            Id = c.Id,
            PostId = c.PostId,
            UserId = c.UserId,
            AuthorDisplayName = c.User?.Profile?.DisplayName,
            Content = c.Content,
            CreatedAtUtc = c.CreatedAtUtc
        }).ToList()
    };
}
