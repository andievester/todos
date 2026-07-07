using Microsoft.Extensions.Options;
using Moq;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Options;
using TodoApp.Application.Services;
using TodoApp.Domain.Entities;

namespace TodoApp.Tests.Application.Services;

public class AuthServiceTests
{
    private readonly Mock<IPasswordHasher> _mockHasher = new();
    private readonly Mock<IUserRepository> _mockRepo = new();
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        var options = Options.Create(new JwtOptions
        {
            Key = "SuperSecretKeyThatIsAtLeast32CharactersLong",
            Issuer = "Test",
            Audience = "Test"
        });

        _service = new AuthService(_mockRepo.Object, _mockHasher.Object, options);
    }

    [Fact]
    public async Task LoginAsync_ReturnsNull_WhenPasswordVerificationFails()
    {
        // Arrange
        var user = new User { Email = "test@test.com", PasswordHash = "hashed" };
        _mockRepo.Setup(r => r.GetUserByEmailAsync("test@test.com", default)).ReturnsAsync(user);

        _mockHasher.Setup(h => h.Verify("wrong", "hashed")).Returns(false);

        // Act
        var result = await _service.LoginAsync(new LoginRequest("test@test.com", "wrong"));

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_ReturnsToken_WhenCredentialsAreValid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { Id = userId, Email = "test@test.com", PasswordHash = "hashed" };
        _mockRepo.Setup(r => r.GetUserByEmailAsync("test@test.com", default)).ReturnsAsync(user);
        _mockHasher.Setup(h => h.Verify("password", "hashed")).Returns(true);

        // Act
        var result = await _service.LoginAsync(new LoginRequest("test@test.com", "password"));

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result?.Token); // JWT
        _mockRepo.Verify(r => r.AddRefreshTokenAsync(It.IsAny<RefreshToken>()), Times.Once);
    }

    [Fact]
    public async Task RefreshTokenAsync_ReturnsNull_WhenTokenIsInactive()
    {
        // Arrange
        var expiredToken = new RefreshToken { IsRevoked = true };

        _mockRepo.Setup(r => r.GetRefreshTokenAsync("bad_token", It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredToken);

        // Act
        var result = await _service.RefreshTokenAsync(new RefreshTokenRequest("bad_token"));

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task RegisterAsync_ReturnsSuccess_WhenEmailIsUnique()
    {
        // Arrange

        _mockRepo.Setup(r => r.EmailExistsAsync("new@test.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _mockHasher.Setup(h => h.HashPassword("secret")).Returns("hashed_pw");

        // Act
        var (success, _, user) = await _service.RegisterAsync(new RegisterRequest("new@test.com", "secret"));

        // Assert
        Assert.True(success);
        Assert.NotNull(user);

        _mockRepo.Verify(r => r.AddUserAsync(It.Is<User>(u => u.Email == "new@test.com")), Times.Once);
    }
}