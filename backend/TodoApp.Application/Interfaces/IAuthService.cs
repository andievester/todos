using TodoApp.Application.DTOs;
using TodoApp.Domain.Models;

namespace TodoApp.Application.Interfaces;

public interface IAuthService
{
    Task<(bool Success, string ErrorMessage, User? User)> RegisterAsync(RegisterRequest req);
    Task<string?> LoginAsync(LoginRequest req, CancellationToken cancellationToken = default);
}