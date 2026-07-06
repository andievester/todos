using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Application;
using TodoApp.Infrastructure;
using TodoApp.Web.Endpoints;
using TodoApp.Web.Extensions;
using TodoApp.Web.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// SERVICE REGISTRATIONS
// ==========================================

// Register layers via extension methods
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// JSON Configuration
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();

// ==========================================
// APP PIPELINE
// ==========================================
var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication(); 
app.UseAuthorization();

// ==========================================
// MAP ENDPOINTS
// ==========================================
app.MapAllEndpoints();

app.Run();