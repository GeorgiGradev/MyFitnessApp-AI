using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFitnessApp.Api.Data;
using MyFitnessApp.Api.Models;
using MyFitnessApp.Api.Models.Dtos;

namespace MyFitnessApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminController(ApplicationDbContext db) => _db = db;

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetUsers(CancellationToken cancellationToken)
    {
        var list = await _db.Users
            .AsNoTracking()
            .Include(u => u.Profile)
            .OrderBy(u => u.Email)
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                Email = u.Email,
                DisplayName = u.Profile != null ? u.Profile.DisplayName : null,
                IsBanned = u.IsBanned,
                IsAdmin = u.IsAdmin
            })
            .ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpPatch("users/{id:guid}/ban")]
    public async Task<ActionResult<AdminUserDto>> SetUserBanned(Guid id, [FromBody] SetBannedRequest request, CancellationToken cancellationToken)
    {
        var user = await _db.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null) return NotFound();
        user.IsBanned = request.IsBanned;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.Profile?.DisplayName,
            IsBanned = user.IsBanned,
            IsAdmin = user.IsAdmin
        });
    }
}

public class SetBannedRequest
{
    public bool IsBanned { get; set; }
}
