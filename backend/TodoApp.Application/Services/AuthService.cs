using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.Services
{
    public class AuthService(IUserRepository userRepository, IConfiguration config) : IAuthService
    {
        public async Task<(bool Success, string ErrorMessage, User? User)> RegisterAsync(RegisterRequest req)
        {
            if (await userRepository.EmailExistsAsync(req.Email))
            {
                return (false, "Email is already in use.", null);
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Email = req.Email,
                PasswordHash = hashedPassword
            };

            await userRepository.AddUserAsync(user);

            return (true, string.Empty, user);
        }

        public async Task<string?> LoginAsync(LoginRequest req, CancellationToken cancellationToken = default)
        {
            var user = await userRepository.GetUserByEmailAsync(req.Email, cancellationToken);

            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return null;
            }

            return GenerateJwtToken(user);
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
                Expires = DateTime.UtcNow.AddDays(1),
                Issuer = config["Jwt:Issuer"],
                Audience = config["Jwt:Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}