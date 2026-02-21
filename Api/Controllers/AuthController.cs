using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFitnessApp.Api.Data;
using MyFitnessApp.Api.Models;
using MyFitnessApp.Api.Models.Dtos;
using MyFitnessApp.Api.Services;

namespace MyFitnessApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly IWebHostEnvironment _env;

    public AuthController(ApplicationDbContext db, ITokenService tokenService, IWebHostEnvironment env)
    {
        _db = db;
        _tokenService = tokenService;
        _env = env;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var normalizedEmail = request.Email.Trim().ToUpperInvariant();
            var exists = await _db.Users.AnyAsync(u => u.NormalizedEmail == normalizedEmail, cancellationToken);
            if (exists)
                return BadRequest(new { message = "Email is already registered." });

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email.Trim(),
                NormalizedEmail = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAtUtc = DateTime.UtcNow,
                IsBanned = false
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync(cancellationToken);

            var token = _tokenService.CreateToken(user);
            return Ok(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                HasProfile = false,
                IsAdmin = false
            });
        }
        catch (Exception ex)
        {
            var message = _env.IsDevelopment() ? ex.Message : "Registration failed.";
            return StatusCode(500, new { message });
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToUpperInvariant();
        var user = await _db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail, cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        if (user.IsBanned)
            return Unauthorized(new { message = "Account is banned." });

        var hasProfile = user.Profile != null && !string.IsNullOrWhiteSpace(user.Profile.DisplayName);
        var token = _tokenService.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            HasProfile = hasProfile,
            IsAdmin = user.IsAdmin
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthResponse>> Me(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _db.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
            return Unauthorized();

        if (user.IsBanned)
            return Unauthorized(new { message = "Account is banned." });

        var hasProfile = user.Profile != null && !string.IsNullOrWhiteSpace(user.Profile.DisplayName);
        var token = _tokenService.CreateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            HasProfile = hasProfile,
            IsAdmin = user.IsAdmin
        });
    }
}
