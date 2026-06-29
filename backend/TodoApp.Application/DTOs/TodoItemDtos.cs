using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs
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
}