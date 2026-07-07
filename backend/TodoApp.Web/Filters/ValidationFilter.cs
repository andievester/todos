using System.ComponentModel.DataAnnotations;

namespace TodoApp.Web.Filters;

public class ValidationFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var argToValidate = context.Arguments.FirstOrDefault(a => a is T);

        if (argToValidate is not null)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(argToValidate);

            var isValid = Validator.TryValidateObject(argToValidate, validationContext, validationResults, true);

            if (!isValid)
            {
                var errors = validationResults
                    .Where(r => r.MemberNames.Any())
                    .GroupBy(e => e.MemberNames.First())
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage ?? "Validation failed.").ToArray()
                    );

                return Results.ValidationProblem(errors);
            }
        }

        return await next(context);
    }
}