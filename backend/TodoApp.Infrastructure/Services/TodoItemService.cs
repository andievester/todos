using Microsoft.EntityFrameworkCore;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Models;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Services
{
    public class TodoItemService(AppDbContext db) : ITodoItemService
    {
        public async Task<List<TodoItemResponse>> GetTodoItemsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await db.TodoItems
                .Where(t => t.UserId == userId)
                .Select(t => new TodoItemResponse(
                    t.Id, 
                    t.Title, 
                    t.Description ?? string.Empty, 
                    t.IsCompleted, 
                    t.DueDate, 
                    t.Priority, 
                    t.UserId
                ))
                .ToListAsync(cancellationToken);
        }

        public async Task<TodoItemResponse> CreateTodoItemAsync(CreateTodoItemRequest req, Guid userId)
        {
            var todoItem = new TodoItem
            {
                Title = req.Title,
                Description = req.Description,
                IsCompleted = req.IsCompleted,
                DueDate = req.DueDate,
                Priority = req.Priority,
                UserId = userId
            };

            db.TodoItems.Add(todoItem);
            await db.SaveChangesAsync();
            
            return new TodoItemResponse(
                todoItem.Id, 
                todoItem.Title, 
                todoItem.Description ?? string.Empty, 
                todoItem.IsCompleted, 
                todoItem.DueDate, 
                todoItem.Priority, 
                todoItem.UserId
            );
        }
        
        public async Task<TodoItemResponse?> UpdateTodoItemAsync(int id, UpdateTodoItemRequest req, Guid userId)
        {
            var todoItem = await db.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todoItem == null)
            {
                return null;
            }

            todoItem.Title = req.Title;
            todoItem.Description = req.Description;
            todoItem.IsCompleted = req.IsCompleted;
            todoItem.DueDate = req.DueDate;
            todoItem.Priority = req.Priority;

            await db.SaveChangesAsync();

            return new TodoItemResponse(
                todoItem.Id,
                todoItem.Title,
                todoItem.Description ?? string.Empty,
                todoItem.IsCompleted,
                todoItem.DueDate,
                todoItem.Priority,
                todoItem.UserId
            );
        }
        
        public async Task<bool> DeleteTodoItemAsync(int id, Guid userId)
        {
            var todoItem = await db.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todoItem == null)
            {
                return false; 
            }

            db.TodoItems.Remove(todoItem);
            await db.SaveChangesAsync();

            return true;
        }
    }
}