using Microsoft.EntityFrameworkCore;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Models;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Services
{
    public class TodoItemService : ITodoItemService
    {
        private readonly AppDbContext _db;

        public TodoItemService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<TodoItemResponse>> GetAllTodoItemsAsync()
        {
            var items = await _db.TodoItems.ToListAsync();
            
            return items.Select(t => new TodoItemResponse(
                t.Id, 
                t.Title, 
                t.Description ?? string.Empty, 
                t.IsCompleted, 
                t.DueDate, 
                t.Priority, 
                t.UserId
            )).ToList();
        }

        public async Task<TodoItemResponse> CreateTodoItemAsync(CreateTodoItemRequest req)
        {
            var todoItem = new TodoItem
            {
                Title = req.Title,
                Description = req.Description,
                IsCompleted = req.IsCompleted,
                DueDate = req.DueDate,
                Priority = req.Priority,
                UserId = req.UserId
            };

            _db.TodoItems.Add(todoItem);
            await _db.SaveChangesAsync();
            
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
    }
}