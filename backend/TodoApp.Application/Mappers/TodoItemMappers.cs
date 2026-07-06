using TodoApp.Application.DTOs;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Mappers
{
    public static class TodoItemMappers
    {
        public static TodoItemResponse ToResponse(this TodoItem item)
        {
            return new TodoItemResponse(
                item.Id,
                item.Title,
                item.Description ?? string.Empty,
                item.IsCompleted,
                item.DueDate,
                item.Priority,
                item.UserId
            );
        }

        public static TodoItem ToEntity(this CreateTodoItemRequest req, Guid userId)
        {
            return new TodoItem
            {
                Title = req.Title,
                Description = req.Description,
                IsCompleted = req.IsCompleted,
                DueDate = req.DueDate,
                Priority = req.Priority,
                UserId = userId
            };
        }

        public static void UpdateEntity(this UpdateTodoItemRequest req, TodoItem item)
        {
            item.Title = req.Title;
            item.Description = req.Description;
            item.IsCompleted = req.IsCompleted;
            item.DueDate = req.DueDate;
            item.Priority = req.Priority;
        }
    }
}