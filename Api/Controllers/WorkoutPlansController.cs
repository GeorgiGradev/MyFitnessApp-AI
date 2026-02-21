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
public class WorkoutPlansController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public WorkoutPlansController(ApplicationDbContext db)
    {
        _db = db;
    }

    private Guid? GetUserId()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkoutPlanDto>>> GetPlans(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var query = _db.WorkoutPlans
            .AsNoTracking()
            .Where(p => p.UserId == userId.Value);
        if (from.HasValue)
            query = query.Where(p => p.PlanDate.Date >= from.Value.Date);
        if (to.HasValue)
            query = query.Where(p => p.PlanDate.Date <= to.Value.Date);

        var plans = await query
            .OrderBy(p => p.PlanDate)
            .Include(p => p.Entries)
            .ThenInclude(e => e.Exercise)
            .Select(p => MapToDto(p))
            .ToListAsync(cancellationToken);
        return Ok(plans);
    }

    [HttpGet("by-date/{date:datetime}")]
    public async Task<ActionResult<WorkoutPlanDto>> GetByDate(DateTime date, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans
            .AsNoTracking()
            .Include(p => p.Entries)
            .ThenInclude(e => e.Exercise)
            .FirstOrDefaultAsync(p => p.UserId == userId.Value && p.PlanDate.Date == date.Date, cancellationToken);
        if (plan == null) return NotFound();
        return Ok(MapToDto(plan));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WorkoutPlanDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans
            .AsNoTracking()
            .Include(p => p.Entries)
            .ThenInclude(e => e.Exercise)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        return Ok(MapToDto(plan));
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutPlanDto>> Create([FromBody] CreateWorkoutPlanRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var planDate = request.PlanDate.Date;
        var exists = await _db.WorkoutPlans.AnyAsync(p => p.UserId == userId.Value && p.PlanDate.Date == planDate, cancellationToken);
        if (exists) return Conflict("A plan already exists for this date.");

        var plan = new WorkoutPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            PlanDate = planDate,
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.WorkoutPlans.Add(plan);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, MapToDto(plan));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<WorkoutPlanDto>> Update(Guid id, [FromBody] CreateWorkoutPlanRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();

        var planDate = request.PlanDate.Date;
        if (planDate != plan.PlanDate.Date)
        {
            var exists = await _db.WorkoutPlans.AnyAsync(p => p.UserId == userId.Value && p.PlanDate.Date == planDate && p.Id != id, cancellationToken);
            if (exists) return Conflict("A plan already exists for this date.");
            plan.PlanDate = planDate;
        }
        await _db.SaveChangesAsync(cancellationToken);
        var updated = await _db.WorkoutPlans.AsNoTracking().Include(p => p.Entries).ThenInclude(e => e.Exercise).FirstAsync(p => p.Id == id, cancellationToken);
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        _db.WorkoutPlans.Remove(plan);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{planId:guid}/entries")]
    public async Task<ActionResult<WorkoutPlanEntryDto>> AddEntry(Guid planId, [FromBody] CreateWorkoutPlanEntryRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans.FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var exercise = await _db.Exercises.FindAsync(new object[] { request.ExerciseId }, cancellationToken);
        if (exercise == null) return BadRequest("Exercise not found.");

        var entry = new WorkoutPlanEntry
        {
            Id = Guid.NewGuid(),
            WorkoutPlanId = planId,
            ExerciseId = request.ExerciseId,
            DurationMinutes = request.DurationMinutes,
            Sets = request.Sets,
            Reps = request.Reps
        };
        _db.WorkoutPlanEntries.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = planId }, new WorkoutPlanEntryDto
        {
            Id = entry.Id,
            ExerciseId = entry.ExerciseId,
            ExerciseName = exercise.Name,
            DurationMinutes = entry.DurationMinutes,
            Sets = entry.Sets,
            Reps = entry.Reps
        });
    }

    [HttpPut("{planId:guid}/entries/{entryId:guid}")]
    public async Task<ActionResult<WorkoutPlanEntryDto>> UpdateEntry(Guid planId, Guid entryId, [FromBody] UpdateWorkoutPlanEntryRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans.FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var entry = await _db.WorkoutPlanEntries.Include(e => e.Exercise).FirstOrDefaultAsync(e => e.Id == entryId && e.WorkoutPlanId == planId, cancellationToken);
        if (entry == null) return NotFound();

        entry.DurationMinutes = request.DurationMinutes;
        entry.Sets = request.Sets;
        entry.Reps = request.Reps;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new WorkoutPlanEntryDto
        {
            Id = entry.Id,
            ExerciseId = entry.ExerciseId,
            ExerciseName = entry.Exercise.Name,
            DurationMinutes = entry.DurationMinutes,
            Sets = entry.Sets,
            Reps = entry.Reps
        });
    }

    [HttpDelete("{planId:guid}/entries/{entryId:guid}")]
    public async Task<ActionResult> DeleteEntry(Guid planId, Guid entryId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var plan = await _db.WorkoutPlans.FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var entry = await _db.WorkoutPlanEntries.FirstOrDefaultAsync(e => e.Id == entryId && e.WorkoutPlanId == planId, cancellationToken);
        if (entry == null) return NotFound();
        _db.WorkoutPlanEntries.Remove(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static WorkoutPlanDto MapToDto(WorkoutPlan p)
    {
        return new WorkoutPlanDto
        {
            Id = p.Id,
            PlanDate = p.PlanDate,
            CreatedAtUtc = p.CreatedAtUtc,
            Entries = p.Entries?.Select(e => new WorkoutPlanEntryDto
            {
                Id = e.Id,
                ExerciseId = e.ExerciseId,
                ExerciseName = e.Exercise?.Name,
                DurationMinutes = e.DurationMinutes,
                Sets = e.Sets,
                Reps = e.Reps
            }).ToList() ?? new List<WorkoutPlanEntryDto>()
        };
    }
}
