using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Application;
using TodoApp.Infrastructure;
using TodoApp.Web.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// SERVICE REGISTRATIONS
// ==========================================

// Register layers via extension methods
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

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

// 1. JWT Authentication Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();

// ==========================================
// APP PIPELINE
// ==========================================
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

// 2. Authentication MUST come before Authorization
app.UseAuthentication(); 
app.UseAuthorization();

// ==========================================
// MAP ENDPOINTS
// ==========================================
// These methods will be defined as static extensions in your Web project
app.MapAuthEndpoints();
app.MapTodoItemEndpoints();
app.MapUserEndpoints();

app.Run();