using MyFitnessApp.Api.Models;

namespace MyFitnessApp.Api.Services;

public interface ITokenService
{
    string CreateToken(User user);
}
