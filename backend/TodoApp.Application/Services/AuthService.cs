using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Options;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Services;

public class AuthService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    IOptions<JwtOptions> jwtOptions) : IAuthService
{
    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<(bool Success, string ErrorMessage, UserResponseDto? User)> RegisterAsync(RegisterRequest req)
    {
        if (await userRepository.EmailExistsAsync(req.Email))
        {
            return (false, "Email is already in use.", null);
        }

        var user = new User
        {
            Email = req.Email,
            PasswordHash = passwordHasher.HashPassword(req.Password)
        };

        await userRepository.AddUserAsync(user);
        return (true, string.Empty, new UserResponseDto(user.Id, user.Email));
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest req, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetUserByEmailAsync(req.Email, cancellationToken);

        if (user is null || !passwordHasher.Verify(req.Password, user.PasswordHash))
        {
            return null;
        }

        var jwtToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken(user.Id);

        await userRepository.AddRefreshTokenAsync(refreshToken);

        return new AuthResponse(jwtToken, refreshToken.Token);
    }

    public async Task<AuthResponse?> RefreshTokenAsync(RefreshTokenRequest req)
    {
        var storedToken = await userRepository.GetRefreshTokenAsync(req.RefreshToken);

        if (storedToken == null || !storedToken.IsActive)
        {
            return null;
        }

        var user = await userRepository.GetUserByIdAsync(storedToken.UserId);
        if (user == null) return null;

        storedToken.IsRevoked = true;
        await userRepository.UpdateRefreshTokenAsync(storedToken);

        var newJwtToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken(user.Id);

        await userRepository.AddRefreshTokenAsync(newRefreshToken);

        return new AuthResponse(newJwtToken, newRefreshToken.Token);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(60),
            Issuer = _jwt.Issuer,
            Audience = _jwt.Audience,
            SigningCredentials = creds
        };

        return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityTokenHandler().CreateToken(tokenDescriptor));
    }

    private RefreshToken GenerateRefreshToken(Guid userId)
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return new RefreshToken
            { Token = Convert.ToBase64String(randomBytes), Expires = DateTime.UtcNow.AddDays(1), UserId = userId };
    }
}