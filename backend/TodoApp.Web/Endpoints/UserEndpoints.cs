using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.Web.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this WebApplication app)
        {
            var users = app.MapGroup("/api/user");

            users.MapPost("/", async (RegisterRequest req, IUserService service) =>
            {
                var createdUser = await service.CreateUserAsync(req);
                return Results.Created($"/api/user/{createdUser.Id}", createdUser);
            });

            users.MapGet("/", async (IUserService service) =>
            {
                var allUsers = await service.GetAllUsersAsync();
                return Results.Ok(allUsers);
            });

            users.MapGet("/{id:guid}", async (Guid id, IUserService service) =>
            {
                var user = await service.GetUserByIdAsync(id);
                return user is not null ? Results.Ok(user) : Results.NotFound();
            });
        }
    }
}