using System.Security.Claims; 
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Web.Endpoints.Interfaces;

namespace TodoApp.Web.Endpoints
{
    public class TodoItemEndpoints : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            var todoItems = app.MapGroup("/api/todos")
                .RequireAuthorization() 
                .WithTags("Todos");

            todoItems.MapGet("/", async (HttpContext context, ITodoItemService todoItemService, CancellationToken cancellationToken) =>
            {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var items = await todoItemService.GetTodoItemsByUserIdAsync(Guid.Parse(userId), cancellationToken);
    
                return Results.Ok(items);
            });

            todoItems.MapPost("/", async (HttpContext context, CreateTodoItemRequest req, ITodoItemService todoItemService) =>
            {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var createdTodoItem = await todoItemService.CreateTodoItemAsync(req, Guid.Parse(userId));
                
                return Results.Created($"/api/todos/{createdTodoItem.Id}", createdTodoItem);
            });
            
            todoItems.MapPut("/{id}", async (int id, UpdateTodoItemRequest req, HttpContext context, ITodoItemService todoItemService) =>
            {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var updatedItem = await todoItemService.UpdateTodoItemAsync(id, req, Guid.Parse(userId));

                return updatedItem is not null 
                    ? Results.Ok(updatedItem) 
                    : Results.NotFound();
            });
            
            todoItems.MapDelete("/{id}", async (int id, HttpContext context, ITodoItemService todoItemService) =>
            {
                var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
                
                if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

                var success = await todoItemService.DeleteTodoItemAsync(id, Guid.Parse(userId));

                return success 
                    ? Results.NoContent() 
                    : Results.NotFound();
            });
        }
    }
}