using Microsoft.AspNetCore.Mvc;

namespace MyFitnessApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello from MyFitnessApp API", timestamp = DateTime.UtcNow });
    }
}
