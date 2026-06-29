using TodoApi.DTOs;

namespace TodoApp.Application.DTOs;

public record UserResponse(Guid Id, string Username, string Email);

public record UserWithTodosResponse(Guid Id, string Username, string Email, List<TodoItemResponse> Todos);