using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Web.Endpoints.Interfaces;
using TodoApp.Web.Filters;

namespace TodoApp.Web.Endpoints;

public class AuthEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var auth = app.MapGroup("/api/auth");

        auth.MapPost("/register", async (RegisterRequest req, IAuthService authService) =>
        {
            var result = await authService.RegisterAsync(req);

            if (!result.Success) return Results.BadRequest(new { message = result.ErrorMessage });

            return Results.Ok(new { result.User!.Id, result.User.Email });
        }).AddEndpointFilter<ValidationFilter<RegisterRequest>>();

        auth.MapPost("/login",
            async (LoginRequest req, IAuthService authService, CancellationToken cancellationToken) =>
            {
                var response = await authService.LoginAsync(req, cancellationToken);

                if (response is null) return Results.Unauthorized();

                return Results.Ok(response);
            }).AddEndpointFilter<ValidationFilter<LoginRequest>>();

        auth.MapPost("/refresh", async (RefreshTokenRequest req, IAuthService authService) =>
        {
            var response = await authService.RefreshTokenAsync(req);

            if (response is null) return Results.Unauthorized();

            return Results.Ok(response);
        }).AddEndpointFilter<ValidationFilter<RefreshTokenRequest>>();
    }
}