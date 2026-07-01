

namespace TodoApp.Application.DTOs;

public record UserResponse(Guid Id, string Email);

public record UserWithTodosResponse(Guid Id, string Email, List<TodoItemResponse> Todos);