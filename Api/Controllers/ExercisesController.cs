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
public class ExercisesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ExercisesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExerciseDto>>> GetAll([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var query = _db.Exercises.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(e => e.Name.ToLower().Contains(search.Trim().ToLower()));
        var list = await query.OrderBy(e => e.Name).Select(e => new ExerciseDto
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Category = e.Category
        }).ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExerciseDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var exercise = await _db.Exercises.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (exercise == null) return NotFound();
        return Ok(MapToDto(exercise));
    }

    [HttpPost]
    public async Task<ActionResult<ExerciseDto>> Create([FromBody] CreateExerciseRequest request, CancellationToken cancellationToken)
    {
        var exercise = new Exercise
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim().Length > 0 ? request.Description.Trim() : null,
            Category = request.Category?.Trim().Length > 0 ? request.Category.Trim() : null,
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.Exercises.Add(exercise);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, MapToDto(exercise));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExerciseDto>> Update(Guid id, [FromBody] CreateExerciseRequest request, CancellationToken cancellationToken)
    {
        var exercise = await _db.Exercises.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (exercise == null) return NotFound();
        exercise.Name = request.Name.Trim();
        exercise.Description = request.Description?.Trim().Length > 0 ? request.Description.Trim() : null;
        exercise.Category = request.Category?.Trim().Length > 0 ? request.Category.Trim() : null;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(MapToDto(exercise));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var exercise = await _db.Exercises.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (exercise == null) return NotFound();
        _db.Exercises.Remove(exercise);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static ExerciseDto MapToDto(Exercise e) => new()
    {
        Id = e.Id,
        Name = e.Name,
        Description = e.Description,
        Category = e.Category
    };
}
