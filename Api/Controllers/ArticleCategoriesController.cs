using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFitnessApp.Api.Data;
using MyFitnessApp.Api.Models;
using MyFitnessApp.Api.Models.Dtos;

namespace MyFitnessApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticleCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ArticleCategoriesController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleCategoryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _db.ArticleCategories.AsNoTracking().OrderBy(c => c.Name)
            .Select(c => new ArticleCategoryDto { Id = c.Id, Name = c.Name }).ToListAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ArticleCategoryDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var cat = await _db.ArticleCategories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (cat == null) return NotFound();
        return Ok(new ArticleCategoryDto { Id = cat.Id, Name = cat.Name });
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ArticleCategoryDto>> Create([FromBody] CreateArticleCategoryRequest request, CancellationToken cancellationToken)
    {
        var name = request.Name.Trim();
        if (await _db.ArticleCategories.AnyAsync(c => c.Name == name, cancellationToken))
            return Conflict("Category with this name already exists.");
        var cat = new ArticleCategory { Id = Guid.NewGuid(), Name = name };
        _db.ArticleCategories.Add(cat);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = cat.Id }, new ArticleCategoryDto { Id = cat.Id, Name = cat.Name });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ArticleCategoryDto>> Update(Guid id, [FromBody] CreateArticleCategoryRequest request, CancellationToken cancellationToken)
    {
        var cat = await _db.ArticleCategories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (cat == null) return NotFound();
        var name = request.Name.Trim();
        if (await _db.ArticleCategories.AnyAsync(c => c.Name == name && c.Id != id, cancellationToken))
            return Conflict("Category with this name already exists.");
        cat.Name = name;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new ArticleCategoryDto { Id = cat.Id, Name = cat.Name });
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var cat = await _db.ArticleCategories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (cat == null) return NotFound();
        _db.ArticleCategories.Remove(cat);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
