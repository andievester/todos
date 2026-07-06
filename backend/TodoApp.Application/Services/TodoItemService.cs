using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Services
{
    public class TodoItemService(ITodoItemRepository repository) : ITodoItemService
    {
        public async Task<List<TodoItemResponse>> GetTodoItemsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var items = await repository.GetTodoItemsByUserIdAsync(userId, cancellationToken);
            
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

            await repository.AddAsync(todoItem);
            
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
            var todoItem = await repository.GetByIdAndUserIdAsync(id, userId);

            if (todoItem == null)
            {
                return null;
            }

            todoItem.Title = req.Title;
            todoItem.Description = req.Description;
            todoItem.IsCompleted = req.IsCompleted;
            todoItem.DueDate = req.DueDate;
            todoItem.Priority = req.Priority;

            await repository.UpdateAsync(todoItem);

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
            var todoItem = await repository.GetByIdAndUserIdAsync(id, userId);

            if (todoItem == null)
            {
                return false; 
            }

            await repository.DeleteAsync(todoItem);

            return true;
        }
    }
}