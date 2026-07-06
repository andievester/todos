using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.DTOs;

public record RegisterRequest(
    [Required, EmailAddress] string Email, 
    [Required, MinLength(8)] string Password
);
public record LoginRequest(
    [Required, EmailAddress] string Email, 
    [Required] string Password
);
public record AuthResponse(
    string Token,
    string RefreshToken
);
public record RefreshTokenRequest(
    [Required] string RefreshToken
);