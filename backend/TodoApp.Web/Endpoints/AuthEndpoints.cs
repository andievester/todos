using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.Web.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
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
                var token = await service.LoginAsync(req);

                if (string.IsNullOrEmpty(token))
                {
                    return Results.Unauthorized();
                }

                return Results.Ok(new { Token = token });
            });
        }
    }
}