using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.DTOs;

public record CreateTodoItemRequest(
    [property: Required]
    [property: MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    string Title,
    [property: MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
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
    [property: Required]
    [property: MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    string Title,
    [property: MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
    string Description,
    bool IsCompleted,
    DateTime? DueDate,
    int Priority
);