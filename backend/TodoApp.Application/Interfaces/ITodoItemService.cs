using TodoApp.Application.DTOs;

namespace TodoApp.Application.Interfaces;

public interface ITodoItemService
{
    Task<List<TodoItemResponse>> GetAllTodoItemsAsync();
    Task<TodoItemResponse> CreateTodoItemAsync(CreateTodoItemRequest req);
}