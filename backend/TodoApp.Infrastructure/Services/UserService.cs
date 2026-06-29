using Microsoft.EntityFrameworkCore;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Models;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<UserResponse> CreateUserAsync(RegisterRequest req)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = hashedPassword
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            
            return new UserResponse(user.Id, user.Username, user.Email);
        }

        public async Task<List<UserWithTodosResponse>> GetAllUsersAsync()
        {
            var users = await _db.Users
                .Include(u => u.TodoList)
                .ToListAsync();

            return users.Select(u => new UserWithTodosResponse(
                u.Id, 
                u.Username, 
                u.Email, 
                u.TodoList.Select(t => new TodoItemResponse(
                    t.Id, 
                    t.Title, 
                    t.Description ?? string.Empty, 
                    t.IsCompleted, 
                    t.DueDate, 
                    t.Priority, 
                    t.UserId
                )).ToList()
            )).ToList();
        }

        public async Task<UserWithTodosResponse?> GetUserByIdAsync(Guid id)
        {
            var user = await _db.Users
                .Include(u => u.TodoList)
                .FirstOrDefaultAsync(u => u.Id == id);

            return user is not null 
                ? new UserWithTodosResponse(
                    user.Id, 
                    user.Username, 
                    user.Email, 
                    user.TodoList.Select(t => new TodoItemResponse(
                        t.Id, 
                        t.Title, 
                        t.Description ?? string.Empty, 
                        t.IsCompleted, 
                        t.DueDate, 
                        t.Priority, 
                        t.UserId
                    )).ToList()) 
                : null;
        }
    }
}