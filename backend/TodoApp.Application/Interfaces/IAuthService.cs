using TodoApp.Application.DTOs;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Interfaces;

public interface IAuthService
{
    Task<(bool Success, string ErrorMessage, UserResponseDto? User)> RegisterAsync(RegisterRequest req);
    Task<AuthResponse?> LoginAsync(LoginRequest req, CancellationToken cancellationToken = default);
    Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest req);
}