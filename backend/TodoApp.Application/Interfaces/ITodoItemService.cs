using TodoApp.Application.DTOs;

namespace TodoApp.Application.Interfaces;

public interface ITodoItemService
{
    Task<List<TodoItemResponse>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<TodoItemResponse> CreateAsync(CreateTodoItemRequest req, Guid userId);
    Task<TodoItemResponse?> UpdateAsync(int id, UpdateTodoItemRequest req, Guid userId);
    Task<bool> DeleteAsync(int id, Guid userId);
}