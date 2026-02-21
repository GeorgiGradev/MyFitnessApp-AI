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
public class MeController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MeController(ApplicationDbContext db)
    {
        _db = db;
    }

    private Guid? GetUserId()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ProfileDto>> GetProfile(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var profile = await _db.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
        if (profile == null)
            return Ok((ProfileDto?)null);

        return Ok(MapToDto(profile));
    }

    [HttpPut("profile")]
    public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var profile = await _db.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (profile == null)
        {
            profile = new Profile
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
                CreatedAtUtc = DateTime.UtcNow
            };
            _db.Profiles.Add(profile);
        }
        else
        {
            profile.UpdatedAtUtc = DateTime.UtcNow;
        }

        if (request.DisplayName != null) profile.DisplayName = request.DisplayName.Trim().Length > 0 ? request.DisplayName.Trim() : null;
        if (request.Gender != null) profile.Gender = request.Gender.Trim().Length > 0 ? request.Gender.Trim() : null;
        profile.DateOfBirth = request.DateOfBirth;
        profile.HeightCm = request.HeightCm;
        profile.WeightKg = request.WeightKg;

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(MapToDto(profile));
    }

    private static ProfileDto MapToDto(Profile p) => new()
    {
        Id = p.Id,
        UserId = p.UserId,
        DisplayName = p.DisplayName,
        Gender = p.Gender,
        DateOfBirth = p.DateOfBirth,
        HeightCm = p.HeightCm,
        WeightKg = p.WeightKg
    };
}
