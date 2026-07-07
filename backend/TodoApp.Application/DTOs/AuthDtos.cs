using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.DTOs;

public record RegisterRequest(
    [property: Required]
    [property: EmailAddress]
    string Email,
    [property: Required]
    [property: MinLength(8)]
    string Password
);

public record LoginRequest(
    [property: Required]
    [property: EmailAddress]
    string Email,
    [property: Required] string Password
);

public record AuthResponse(
    string Token,
    string RefreshToken
);

public record RefreshTokenRequest(
    [property: Required] string RefreshToken
);