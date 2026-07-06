using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
        Task AddUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
    }
}