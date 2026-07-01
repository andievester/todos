using TodoApp.Application.DTOs;

namespace TodoApp.Application.Interfaces;

public interface ITodoItemService
{
    Task<List<TodoItemResponse>> GetTodoItemsByUserIdAsync(Guid userId);
    Task<TodoItemResponse> CreateTodoItemAsync(CreateTodoItemRequest req, Guid userId);
}