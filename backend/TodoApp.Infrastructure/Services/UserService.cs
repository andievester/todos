using Microsoft.EntityFrameworkCore;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Models;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Services
{
    public class UserService(AppDbContext db) : IUserService
    { 
        public async Task<UserResponse> CreateUserAsync(RegisterRequest req)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Email = req.Email,
                PasswordHash = hashedPassword
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();
            
            return new UserResponse(user.Id,  user.Email);
        }

        public async Task<List<UserWithTodosResponse>> GetAllUsersAsync()
        {
            var users = await db.Users
                .Include(u => u.TodoList)
                .ToListAsync();

            return users.Select(u => new UserWithTodosResponse(
                u.Id, 
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
            var user = await db.Users
                .Include(u => u.TodoList)
                .FirstOrDefaultAsync(u => u.Id == id);

            return user is not null 
                ? new UserWithTodosResponse(
                    user.Id,  
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