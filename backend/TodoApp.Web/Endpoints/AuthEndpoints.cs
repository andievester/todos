using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.Web.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this WebApplication app)
        {
            var auth = app.MapGroup("/api/auth");

            auth.MapPost("/register", async (RegisterRequest req, IAuthService service) =>
            {
                var result = await service.RegisterAsync(req);

                if (!result.Success)
                {
                    return Results.BadRequest(result.ErrorMessage);
                }

                return Results.Ok(new { result.User!.Id, result.User.Username, result.User.Email });
            });

            auth.MapPost("/login", async (LoginRequest req, IAuthService service) =>
            {
                var isValid = await service.LoginAsync(req);

                if (!isValid)
                {
                    return Results.Unauthorized();
                }

                return Results.Ok(new { Message = "Login successful!" });
            });
        }
    }
}