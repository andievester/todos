using TodoApp.Domain.Entities;

namespace TodoApp.Application.Interfaces;

public interface ITodoItemRepository
{
    Task<List<TodoItem>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(TodoItem item);
    Task<TodoItem?> GetByIdAndUserIdAsync(int id, Guid userId);
    Task UpdateAsync(TodoItem item);
    Task DeleteAsync(TodoItem item);
}