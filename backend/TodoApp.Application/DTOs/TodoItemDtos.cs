using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.DTOs
{
    public record CreateTodoItemRequest(
        [Required] string Title,
        string Description,
        bool IsCompleted, 
        DateTime? DueDate,
        int Priority,
        Guid UserId
    );

    public record TodoItemResponse(
        int Id, 
        string Title, 
        string Description,
        bool IsCompleted,
        DateTime? DueDate,
        int Priority,
        Guid UserId
    );
    
    public record UpdateTodoItemRequest(
        string Title,
        string? Description,
        bool IsCompleted,
        DateTime? DueDate,
        int Priority
    );
}