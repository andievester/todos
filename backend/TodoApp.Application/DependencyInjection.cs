using Microsoft.Extensions.DependencyInjection;

namespace TodoApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        return services;
    }
}