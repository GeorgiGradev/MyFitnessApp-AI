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
public class FoodsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public FoodsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FoodDto>>> GetAll([FromQuery] string? search, CancellationToken cancellationToken)
    {
        var query = _db.Foods.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(f => f.Name.ToLower().Contains(search.Trim().ToLower()));
        var list = await query.OrderBy(f => f.Name).Select(f => new FoodDto
        {
            Id = f.Id,
            Name = f.Name,
            CaloriesPer100g = f.CaloriesPer100g,
            ProteinPer100g = f.ProteinPer100g,
            CarbsPer100g = f.CarbsPer100g,
            FatPer100g = f.FatPer100g
        }).ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FoodDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var food = await _db.Foods.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        if (food == null) return NotFound();
        return Ok(MapToDto(food));
    }

    [HttpPost]
    public async Task<ActionResult<FoodDto>> Create([FromBody] CreateFoodRequest request, CancellationToken cancellationToken)
    {
        var food = new Food
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            CaloriesPer100g = request.CaloriesPer100g,
            ProteinPer100g = request.ProteinPer100g,
            CarbsPer100g = request.CarbsPer100g,
            FatPer100g = request.FatPer100g,
            CreatedAtUtc = DateTime.UtcNow
        };
        _db.Foods.Add(food);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = food.Id }, MapToDto(food));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<FoodDto>> Update(Guid id, [FromBody] CreateFoodRequest request, CancellationToken cancellationToken)
    {
        var food = await _db.Foods.FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        if (food == null) return NotFound();
        food.Name = request.Name.Trim();
        food.CaloriesPer100g = request.CaloriesPer100g;
        food.ProteinPer100g = request.ProteinPer100g;
        food.CarbsPer100g = request.CarbsPer100g;
        food.FatPer100g = request.FatPer100g;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(MapToDto(food));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var food = await _db.Foods.FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        if (food == null) return NotFound();
        _db.Foods.Remove(food);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static FoodDto MapToDto(Food f) => new()
    {
        Id = f.Id,
        Name = f.Name,
        CaloriesPer100g = f.CaloriesPer100g,
        ProteinPer100g = f.ProteinPer100g,
        CarbsPer100g = f.CarbsPer100g,
        FatPer100g = f.FatPer100g
    };
}
