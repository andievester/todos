using TodoApp.Application.DTOs;

namespace TodoApp.Application.Interfaces;

public interface IUserService
{
    Task<UserResponse> CreateUserAsync(RegisterRequest req);
    Task<List<UserWithTodosResponse>> GetAllUsersAsync();
    Task<UserWithTodosResponse?> GetUserByIdAsync(Guid id);
}