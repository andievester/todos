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

            auth.MapPost("/register", async (RegisterRequest req, IAuthService authService) =>
            {
                var result = await authService.RegisterAsync(req);

                if (!result.Success)
                {
                    return Results.BadRequest(new { message = result.ErrorMessage });
                }

                return Results.Ok(new { result.User!.Id, result.User.Email });
            });

            auth.MapPost("/login", async (LoginRequest req, IAuthService authService, CancellationToken cancellationToken) =>
            {
                var token = await authService.LoginAsync(req, cancellationToken);

                if (string.IsNullOrEmpty(token))
                {
                    return Results.Unauthorized();
                }

                return Results.Ok(new { Token = token });
            });
        }
    }
}