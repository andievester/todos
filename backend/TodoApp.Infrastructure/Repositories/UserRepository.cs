using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Interfaces;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Repositories
{
    public class UserRepository(AppDbContext db) : IUserRepository
    {
        public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
        {
            return await db.Users.AnyAsync(u => u.Email == email, cancellationToken);
        }

        public async Task AddUserAsync(User user)
        {
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            return await db.Users.SingleOrDefaultAsync(u => u.Email == email, cancellationToken);
        }
    }
}