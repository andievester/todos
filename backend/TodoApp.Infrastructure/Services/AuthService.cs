using Microsoft.EntityFrameworkCore;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Models;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;

        public AuthService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<(bool Success, string ErrorMessage, User? User)> RegisterAsync(RegisterRequest req)
        {
            if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            {
                return (false, "Email is already in use.", null);
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = hashedPassword
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return (true, string.Empty, user);
        }

        public async Task<bool> LoginAsync(LoginRequest req)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email);

            if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return false;
            }

            return true;
        }
    }
}