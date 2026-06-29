using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.Web.Endpoints
{
    public static class TodoItemEndpoints
    {
        public static void MapTodoItemEndpoints(this WebApplication app)
        {
            var todoItems = app.MapGroup("/api/todo");

            todoItems.MapGet("/", async (ITodoItemService itemService) =>
            {
                var items = await itemService.GetAllTodoItemsAsync();
                return Results.Ok(items);
            });

            todoItems.MapPost("/", async (CreateTodoItemRequest req, ITodoItemService itemService) =>
            {
                var createdTodoItem = await itemService.CreateTodoItemAsync(req);
                return Results.Created($"/api/todo/{createdTodoItem.Id}", createdTodoItem);
            });
        }
    }
}