namespace TodoApp.Tests.Application.Services
{
    using Moq;
    using TodoApp.Application.DTOs;
    using TodoApp.Application.Interfaces;
    using TodoApp.Application.Services;
    using TodoApp.Domain.Entities;

    public class TodoItemServiceTests
    {
        private readonly Mock<ITodoItemRepository> _mockRepo;
        private readonly TodoItemService _service;

        public TodoItemServiceTests()
        {
            _mockRepo = new Mock<ITodoItemRepository>();
            _service = new TodoItemService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetTodoItemsByUserIdAsync_ShouldReturnMappedList()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var items = new List<TodoItem> { new() { Id = 1, Title = "Test" } };
            _mockRepo.Setup(r => r.GetTodoItemsByUserIdAsync(userId, default))
                     .ReturnsAsync(items);

            // Act
            var result = await _service.GetTodoItemsByUserIdAsync(userId);

            // Assert
            Assert.Single(result);
            Assert.Equal("Test", result[0].Title);
        }

        [Fact]
        public async Task CreateTodoItemAsync_ShouldReturnResponse_WhenCreated()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var req = new CreateTodoItemRequest("New", "Desc", false, null, 1, userId);

            // Act
            var result = await _service.CreateTodoItemAsync(req, userId);

            // Assert
            Assert.NotNull(result);
            _mockRepo.Verify(r => r.AddAsync(It.IsAny<TodoItem>()), Times.Once);
        }

        [Fact]
        public async Task UpdateTodoItemAsync_ShouldReturnUpdated_WhenTodoExists()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var existing = new TodoItem { Id = 1, Title = "Old" };
            var req = new UpdateTodoItemRequest("New", "Desc", false, null, 1);

            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, userId)).ReturnsAsync(existing);

            // Act
            var result = await _service.UpdateTodoItemAsync(1, req, userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New", existing.Title); // Verify entity was updated
            _mockRepo.Verify(r => r.UpdateAsync(existing), Times.Once);
        }

        [Fact]
        public async Task DeleteTodoItemAsync_ShouldReturnFalse_WhenTodoDoesNotExist()
        {
            // Arrange
            var userId = Guid.NewGuid();
            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, userId)).ReturnsAsync((TodoItem?)null);

            // Act
            var result = await _service.DeleteTodoItemAsync(1, userId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteTodoItemAsync_ShouldReturnTrue_WhenDeleted()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var existing = new TodoItem { Id = 1, Title = "Test Item" };
            _mockRepo.Setup(r => r.GetByIdAndUserIdAsync(1, userId)).ReturnsAsync(existing);

            // Act
            var result = await _service.DeleteTodoItemAsync(1, userId);

            // Assert
            Assert.True(result);
            _mockRepo.Verify(r => r.DeleteAsync(existing), Times.Once);
        }
    }
}