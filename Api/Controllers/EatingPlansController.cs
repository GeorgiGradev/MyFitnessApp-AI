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
public class EatingPlansController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public EatingPlansController(ApplicationDbContext db) => _db = db;

    private Guid? GetUserId()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(id, out var guid) ? guid : null;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EatingPlanDto>>> GetPlans(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var query = _db.EatingPlans.AsNoTracking().Where(p => p.UserId == userId.Value);
        if (from.HasValue) query = query.Where(p => p.PlanDate.Date >= from.Value.Date);
        if (to.HasValue) query = query.Where(p => p.PlanDate.Date <= to.Value.Date);
        var plans = await query.OrderBy(p => p.PlanDate).Include(p => p.Entries).ThenInclude(e => e.Food).ToListAsync(cancellationToken);
        return Ok(plans.Select(MapToDto));
    }

    [HttpGet("by-date/{date:datetime}")]
    public async Task<ActionResult<EatingPlanDto>> GetByDate(DateTime date, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.AsNoTracking().Include(p => p.Entries).ThenInclude(e => e.Food)
            .FirstOrDefaultAsync(p => p.UserId == userId.Value && p.PlanDate.Date == date.Date, cancellationToken);
        if (plan == null) return NotFound();
        return Ok(MapToDto(plan));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EatingPlanDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.AsNoTracking().Include(p => p.Entries).ThenInclude(e => e.Food)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        return Ok(MapToDto(plan));
    }

    [HttpPost]
    public async Task<ActionResult<EatingPlanDto>> Create([FromBody] CreateEatingPlanRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var planDate = request.PlanDate.Date;
        if (await _db.EatingPlans.AnyAsync(p => p.UserId == userId.Value && p.PlanDate.Date == planDate, cancellationToken))
            return Conflict("A plan already exists for this date.");
        var plan = new EatingPlan { Id = Guid.NewGuid(), UserId = userId.Value, PlanDate = planDate, CreatedAtUtc = DateTime.UtcNow };
        _db.EatingPlans.Add(plan);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, MapToDto(plan));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EatingPlanDto>> Update(Guid id, [FromBody] CreateEatingPlanRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var planDate = request.PlanDate.Date;
        if (planDate != plan.PlanDate.Date)
        {
            if (await _db.EatingPlans.AnyAsync(p => p.UserId == userId.Value && p.PlanDate.Date == planDate && p.Id != id, cancellationToken))
                return Conflict("A plan already exists for this date.");
            plan.PlanDate = planDate;
        }
        await _db.SaveChangesAsync(cancellationToken);
        var updated = await _db.EatingPlans.AsNoTracking().Include(p => p.Entries).ThenInclude(e => e.Food).FirstAsync(p => p.Id == id, cancellationToken);
        return Ok(MapToDto(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        _db.EatingPlans.Remove(plan);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{planId:guid}/entries")]
    public async Task<ActionResult<EatingPlanEntryDto>> AddEntry(Guid planId, [FromBody] CreateEatingPlanEntryRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var food = await _db.Foods.FindAsync(new object[] { request.FoodId }, cancellationToken);
        if (food == null) return BadRequest("Food not found.");
        var entry = new EatingPlanEntry { Id = Guid.NewGuid(), EatingPlanId = planId, FoodId = request.FoodId, QuantityGrams = request.QuantityGrams };
        _db.EatingPlanEntries.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = planId }, new EatingPlanEntryDto { Id = entry.Id, FoodId = entry.FoodId, FoodName = food.Name, QuantityGrams = entry.QuantityGrams });
    }

    [HttpPut("{planId:guid}/entries/{entryId:guid}")]
    public async Task<ActionResult<EatingPlanEntryDto>> UpdateEntry(Guid planId, Guid entryId, [FromBody] UpdateEatingPlanEntryRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var entry = await _db.EatingPlanEntries.Include(e => e.Food).FirstOrDefaultAsync(e => e.Id == entryId && e.EatingPlanId == planId, cancellationToken);
        if (entry == null) return NotFound();
        entry.QuantityGrams = request.QuantityGrams;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new EatingPlanEntryDto { Id = entry.Id, FoodId = entry.FoodId, FoodName = entry.Food.Name, QuantityGrams = entry.QuantityGrams });
    }

    [HttpDelete("{planId:guid}/entries/{entryId:guid}")]
    public async Task<ActionResult> DeleteEntry(Guid planId, Guid entryId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        var plan = await _db.EatingPlans.FirstOrDefaultAsync(p => p.Id == planId && p.UserId == userId.Value, cancellationToken);
        if (plan == null) return NotFound();
        var entry = await _db.EatingPlanEntries.FirstOrDefaultAsync(e => e.Id == entryId && e.EatingPlanId == planId, cancellationToken);
        if (entry == null) return NotFound();
        _db.EatingPlanEntries.Remove(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static EatingPlanDto MapToDto(EatingPlan p) => new()
    {
        Id = p.Id,
        PlanDate = p.PlanDate,
        CreatedAtUtc = p.CreatedAtUtc,
        Entries = (p.Entries ?? new List<EatingPlanEntry>()).Select(e => new EatingPlanEntryDto { Id = e.Id, FoodId = e.FoodId, FoodName = e.Food?.Name, QuantityGrams = e.QuantityGrams }).ToList()
    };
}
