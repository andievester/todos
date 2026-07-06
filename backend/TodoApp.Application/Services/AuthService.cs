using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Services
{
    public class AuthService(IUserRepository userRepository, IConfiguration config) : IAuthService
    {
        public async Task<(bool Success, string ErrorMessage, UserResponseDto? User)> RegisterAsync(RegisterRequest req)
        {
            if (await userRepository.EmailExistsAsync(req.Email))
            {
                return (false, "Email is already in use.", null);
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Email = req.Email,
                PasswordHash = hashedPassword
            };

            await userRepository.AddUserAsync(user);
            
            var responseDto = new UserResponseDto(user.Id, user.Email);

            return (true, string.Empty, responseDto);
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest req, CancellationToken cancellationToken = default)
        {
            var user = await userRepository.GetUserByEmailAsync(req.Email, cancellationToken);

            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
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
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60), 
                Issuer = config["Jwt:Issuer"],
                Audience = config["Jwt:Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private RefreshToken GenerateRefreshToken(Guid userId)
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomBytes),
                Expires = DateTime.UtcNow.AddDays(1), 
                Created = DateTime.UtcNow,
                IsRevoked = false,
                UserId = userId
            };
        }
    }
}