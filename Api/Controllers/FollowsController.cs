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
public class FollowsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public FollowsController(ApplicationDbContext db) => _db = db;

    private Guid? GetUserId()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserListItemDto>>> GetUsers([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var followingIds = await _db.UserFollows
            .Where(f => f.FollowerUserId == userId.Value)
            .Select(f => f.FollowingUserId)
            .ToListAsync(cancellationToken);

        var query = _db.Users
            .AsNoTracking()
            .Where(u => !u.IsBanned && u.Id != userId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u =>
                (u.Profile != null && u.Profile.DisplayName != null && u.Profile.DisplayName.ToLower().Contains(term)) ||
                u.Email.ToLower().Contains(term));
        }

        var users = await query
            .Include(u => u.Profile)
            .OrderBy(u => u.Profile != null ? u.Profile.DisplayName ?? u.Email : u.Email)
            .Take(100)
            .Select(u => new UserListItemDto
            {
                Id = u.Id,
                DisplayName = u.Profile != null && !string.IsNullOrEmpty(u.Profile.DisplayName) ? u.Profile.DisplayName : u.Email,
                IsFollowing = followingIds.Contains(u.Id)
            })
            .ToListAsync(cancellationToken);

        return Ok(users);
    }

    [HttpGet("following")]
    public async Task<ActionResult<IEnumerable<FollowerDto>>> GetFollowing(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var list = await _db.UserFollows
            .AsNoTracking()
            .Where(f => f.FollowerUserId == userId.Value)
            .Include(f => f.FollowingUser).ThenInclude(u => u.Profile)
            .OrderBy(f => f.CreatedAtUtc)
            .Select(f => new FollowerDto
            {
                UserId = f.FollowingUserId,
                DisplayName = f.FollowingUser.Profile != null && !string.IsNullOrEmpty(f.FollowingUser.Profile.DisplayName)
                    ? f.FollowingUser.Profile.DisplayName
                    : f.FollowingUser.Email
            })
            .ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("followers")]
    public async Task<ActionResult<IEnumerable<FollowerDto>>> GetFollowers(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var list = await _db.UserFollows
            .AsNoTracking()
            .Where(f => f.FollowingUserId == userId.Value)
            .Include(f => f.FollowerUser).ThenInclude(u => u.Profile)
            .OrderBy(f => f.CreatedAtUtc)
            .Select(f => new FollowerDto
            {
                UserId = f.FollowerUserId,
                DisplayName = f.FollowerUser.Profile != null && !string.IsNullOrEmpty(f.FollowerUser.Profile.DisplayName)
                    ? f.FollowerUser.Profile.DisplayName
                    : f.FollowerUser.Email
            })
            .ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpPost("{targetUserId:guid}")]
    public async Task<ActionResult> Follow(Guid targetUserId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        if (targetUserId == userId.Value) return BadRequest("Cannot follow yourself.");

        var target = await _db.Users.FindAsync(new object[] { targetUserId }, cancellationToken);
        if (target == null) return NotFound("User not found.");
        if (target.IsBanned) return BadRequest("Cannot follow that user.");

        var exists = await _db.UserFollows.AnyAsync(f => f.FollowerUserId == userId.Value && f.FollowingUserId == targetUserId, cancellationToken);
        if (exists) return Conflict("Already following.");

        _db.UserFollows.Add(new UserFollow
        {
            FollowerUserId = userId.Value,
            FollowingUserId = targetUserId,
            CreatedAtUtc = DateTime.UtcNow
        });
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{targetUserId:guid}")]
    public async Task<ActionResult> Unfollow(Guid targetUserId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var follow = await _db.UserFollows.FirstOrDefaultAsync(
            f => f.FollowerUserId == userId.Value && f.FollowingUserId == targetUserId, cancellationToken);
        if (follow == null) return NotFound("Not following this user.");
        _db.UserFollows.Remove(follow);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
