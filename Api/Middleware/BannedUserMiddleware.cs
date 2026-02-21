using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using MyFitnessApp.Api.Data;

namespace MyFitnessApp.Api.Middleware;

public class BannedUserMiddleware
{
    private readonly RequestDelegate _next;

    public BannedUserMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext db)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var idClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(idClaim, out var userId))
            {
                var isBanned = await db.Users
                    .AsNoTracking()
                    .Where(u => u.Id == userId)
                    .Select(u => u.IsBanned)
                    .FirstOrDefaultAsync(context.RequestAborted);
                if (isBanned)
                {
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(new { message = "Account is banned." });
                    return;
                }
            }
        }
        await _next(context);
    }
}
