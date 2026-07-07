using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.Tests.Web.Endpoints;

public class TodoItemEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly Mock<ITodoItemService> _mockService = new();
    private readonly Guid _testUserId = Guid.NewGuid();

    public TodoItemEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddScoped(_ => _mockService.Object);

                services.AddAuthentication("TestAuth")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("TestAuth", options => { });
            });
        });
    }

    [Fact]
    public async Task GetTodos_ReturnsOk_WithItems_WhenAuthenticated()
    {
        // Arrange
        var client = _factory.CreateClient();
        var mockResponse = new List<TodoItemResponse>
        {
            new(1, "Test Todo", "Description", false, null, 1, Guid.NewGuid())
        };

        _mockService.Setup(s => s.GetTodoItemsByUserIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResponse);

        // Act
        var response = await client.GetAsync("/api/todos");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var items = await response.Content.ReadFromJsonAsync<List<TodoItemResponse>>();

        Assert.NotNull(items);
        Assert.Single(items);
    }

    [Fact]
    public async Task PutTodo_ReturnsNotFound_WhenItemDoesNotExist()
    {
        // Arrange
        var client = _factory.CreateClient();
        var requestDto = new UpdateTodoItemRequest("Update", "Desc", false, null, 2);

        _mockService.Setup(s => s.UpdateTodoItemAsync(999, requestDto, _testUserId))
            .ReturnsAsync((TodoItemResponse?)null);

        // Act
        var response = await client.PutAsJsonAsync("/api/todos/999", requestDto);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateTodo_ReturnsBadRequest_WhenTitleExceedsMaxLength()
    {
        // Arrange
        var client = _factory.CreateClient();

        var invalidTitle = new string('A', 101);
        var request = new CreateTodoItemRequest(
            invalidTitle,
            "Valid Description",
            false,
            null,
            1,
            Guid.NewGuid()
        );

        // Act
        var response = await client.PostAsJsonAsync("/api/todos", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.True(problemDetails.Errors.ContainsKey("Title"));
        Assert.Contains("Title cannot exceed 100 characters.", problemDetails.Errors["Title"]);
    }

    [Fact]
    public async Task PutTodo_ReturnsOk_WithUpdatedItem_WhenSuccessful()
    {
        // Arrange
        var client = _factory.CreateClient();
        var todoId = 1;

        var request = new UpdateTodoItemRequest(
            "Test Task",
            "Test Description",
            true,
            null,
            1
        );

        var mockResponse = new TodoItemResponse(
            todoId,
            request.Title,
            request.Description,
            request.IsCompleted,
            request.DueDate,
            request.Priority,
            Guid.NewGuid()
        );

        _mockService.Setup(s => s.UpdateTodoItemAsync(todoId, request, It.IsAny<Guid>()))
            .ReturnsAsync(mockResponse);

        // Act
        var response = await client.PutAsJsonAsync($"/api/todos/{todoId}", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<TodoItemResponse>();
        Assert.NotNull(result);
        Assert.Equal(todoId, result.Id);
        Assert.Equal("Test Task", result.Title);
        Assert.True(result.IsCompleted);
    }

    [Fact]
    public async Task DeleteTodo_ReturnsNoContent_WhenSuccessful()
    {
        // Arrange
        var client = _factory.CreateClient();
        var todoId = 1;

        _mockService.Setup(s => s.DeleteTodoItemAsync(todoId, It.IsAny<Guid>()))
            .ReturnsAsync(true);

        // Act
        var response = await client.DeleteAsync($"/api/todos/{todoId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
}

public class TestAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "TestAuth");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}