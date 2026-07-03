using System.Reflection;
using TodoApp.Web.Endpoints.Interfaces;

namespace TodoApp.Web.Extensions
{
    public static class EndpointExtensions
    {
        public static IEndpointRouteBuilder MapAllEndpoints(this IEndpointRouteBuilder app)
        {
            var assembly = Assembly.GetExecutingAssembly();

            var endpointTypes = assembly.GetTypes()
                .Where(type => typeof(IEndpoint).IsAssignableFrom(type) 
                               && !type.IsInterface 
                               && !type.IsAbstract);

            foreach (var type in endpointTypes)
            {
                var endpoint = (IEndpoint)Activator.CreateInstance(type)!;
                endpoint.MapEndpoint(app);
            }

            return app;
        }
    }
}