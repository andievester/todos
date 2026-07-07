using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.Tests.Web.Endpoints;

public class AuthEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly Mock<IAuthService> _mockAuthService = new();

    public AuthEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services => { services.AddScoped(_ => _mockAuthService.Object); });
        });
    }

    [Fact]
    public async Task Register_ReturnsOk_WithUser_WhenRegistrationSucceeds()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RegisterRequest("newuser@example.com", "SecurePassword123!");
        var mockUserDto = new UserResponseDto(Guid.NewGuid(), "newuser@example.com");

        _mockAuthService.Setup(s => s.RegisterAsync(request))
            .ReturnsAsync((true, string.Empty, mockUserDto));

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var jsonResult = await response.Content.ReadFromJsonAsync<UserResponseDto>();
        Assert.NotNull(jsonResult);
        Assert.Equal("newuser@example.com", jsonResult.Email);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenEmailAlreadyInUse()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RegisterRequest("duplicate@example.com", "Password123!");

        _mockAuthService.Setup(s => s.RegisterAsync(request))
            .ReturnsAsync((false, "Email is already in use.", null));

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenInputsAreInvalid()
    {
        // Arrange
        var client = _factory.CreateClient();

        var request = new RegisterRequest("not-an-email", "short");

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);

        Assert.True(problemDetails.Errors.ContainsKey("Email"));
        Assert.True(problemDetails.Errors.ContainsKey("Password"));
    }

    [Fact]
    public async Task Login_ReturnsOk_WithAuthTokens_WhenCredentialsAreValid()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new LoginRequest("test@example.com", "CorrectPassword!");
        var expectedResponse = new AuthResponse("valid-jwt-access-token", "valid-refresh-token");

        _mockAuthService.Setup(s => s.LoginAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var tokenBody = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(tokenBody);
        Assert.Equal("valid-jwt-access-token", tokenBody.Token);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new LoginRequest("test@example.com", "WrongPassword!");

        _mockAuthService.Setup(s => s.LoginAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AuthResponse?)null);

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Refresh_ReturnsOk_WithNewTokens_WhenTokenIsValid()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RefreshTokenRequest("valid-refresh-token");
        var expectedResponse = new AuthResponse("new-jwt-access-token", "new-refresh-token");

        _mockAuthService.Setup(s => s.RefreshTokenAsync(request))
            .ReturnsAsync(expectedResponse);

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/refresh", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var tokenBody = await response.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(tokenBody);
        Assert.Equal("new-jwt-access-token", tokenBody.Token);
    }

    [Fact]
    public async Task Refresh_ReturnsUnauthorized_WhenTokenIsExpiredOrRevoked()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RefreshTokenRequest("invalid-or-expired-token");

        _mockAuthService.Setup(s => s.RefreshTokenAsync(request))
            .ReturnsAsync((AuthResponse?)null);

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/refresh", request);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}