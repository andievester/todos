using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Mappers;

namespace TodoApp.Application.Services;

public class TodoItemService(ITodoItemRepository repository) : ITodoItemService
{
    public async Task<List<TodoItemResponse>> GetByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        var items = await repository.GetByUserIdAsync(userId, cancellationToken);

        return items.Select(t => t.ToResponse()).ToList();
    }

    public async Task<TodoItemResponse> CreateAsync(CreateTodoItemRequest req, Guid userId)
    {
        var todoItem = req.ToEntity(userId);

        await repository.AddAsync(todoItem);

        return todoItem.ToResponse();
    }

    public async Task<TodoItemResponse?> UpdateAsync(int id, UpdateTodoItemRequest req, Guid userId)
    {
        var todoItem = await repository.GetByIdAndUserIdAsync(id, userId);

        if (todoItem == null) return null;

        req.UpdateEntity(todoItem);

        await repository.UpdateAsync(todoItem);

        return todoItem.ToResponse();
    }

    public async Task<bool> DeleteAsync(int id, Guid userId)
    {
        var todoItem = await repository.GetByIdAndUserIdAsync(id, userId);

        if (todoItem == null) return false;

        await repository.DeleteAsync(todoItem);

        return true;
    }
}