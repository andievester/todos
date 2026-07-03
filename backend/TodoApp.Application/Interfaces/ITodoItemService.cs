using TodoApp.Application.DTOs;

namespace TodoApp.Application.Interfaces;

public interface ITodoItemService
{
    Task<List<TodoItemResponse>> GetTodoItemsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<TodoItemResponse> CreateTodoItemAsync(CreateTodoItemRequest req, Guid userId);
    Task<TodoItemResponse?> UpdateTodoItemAsync(int id, UpdateTodoItemRequest req, Guid userId);
    Task<bool> DeleteTodoItemAsync(int id, Guid userId);
}