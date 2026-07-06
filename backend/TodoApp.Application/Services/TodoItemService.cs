using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Mappers;

namespace TodoApp.Application.Services
{
    public class TodoItemService(ITodoItemRepository repository) : ITodoItemService
    {
        public async Task<List<TodoItemResponse>> GetTodoItemsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var items = await repository.GetTodoItemsByUserIdAsync(userId, cancellationToken);
            
            return items.Select(t => t.ToResponse()).ToList();
        }

        public async Task<TodoItemResponse> CreateTodoItemAsync(CreateTodoItemRequest req, Guid userId)
        {
            var todoItem = req.ToEntity(userId);

            await repository.AddAsync(todoItem);
            
            return todoItem.ToResponse();
        }
        
        public async Task<TodoItemResponse?> UpdateTodoItemAsync(int id, UpdateTodoItemRequest req, Guid userId)
        {
            var todoItem = await repository.GetByIdAndUserIdAsync(id, userId);

            if (todoItem == null)
            {
                return null;
            }

            req.UpdateEntity(todoItem);

            await repository.UpdateAsync(todoItem);

            return todoItem.ToResponse();
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