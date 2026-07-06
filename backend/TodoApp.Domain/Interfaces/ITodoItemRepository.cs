using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces
{
    public interface ITodoItemRepository
    {
        Task<List<TodoItem>> GetTodoItemsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
        Task AddAsync(TodoItem item);
        Task<TodoItem?> GetByIdAndUserIdAsync(int id, Guid userId);
        Task UpdateAsync(TodoItem item);
        Task DeleteAsync(TodoItem item);
    }
}