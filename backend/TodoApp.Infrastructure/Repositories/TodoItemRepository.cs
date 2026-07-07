using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Repositories;

public class TodoItemRepository(AppDbContext db) : ITodoItemRepository
{
    public async Task<List<TodoItem>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await db.TodoItems.Where(t => t.UserId == userId).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(TodoItem item)
    {
        db.TodoItems.Add(item);
        await db.SaveChangesAsync();
    }

    public async Task<TodoItem?> GetByIdAndUserIdAsync(int id, Guid userId)
    {
        return await db.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
    }

    public async Task UpdateAsync(TodoItem item)
    {
        db.TodoItems.Update(item);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(TodoItem item)
    {
        db.TodoItems.Remove(item);
        await db.SaveChangesAsync();
    }
}