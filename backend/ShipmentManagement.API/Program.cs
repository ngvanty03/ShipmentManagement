using ShipmentManagement.Application;
using ShipmentManagement.Infrastructure;
using ShipmentManagement.API.Middleware;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Domain.Entities;
using ShipmentManagement.Domain.Enums;
using ShipmentManagement.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Use port 2026
//builder.WebHost.UseUrls("http://*:2026");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi("ShipmentManagement"); // .NET 9 default openapi generator

// Add Clean Arch Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Auto-migrate and seed dummy data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();

    if (!db.Users.Any())
    {
        var passwordHasher = new PasswordHasher<User>();
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@example.com",
            FirstName = "System",
            LastName = "Admin",
            IsActive = true,
            Role = Role.Admin
        };
        adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "admin@123456");

        db.Users.Add(adminUser);
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    /*app.MapScalarApiReference(options =>
    {
        options.WithTitle("ShipmentManagement API")
               .WithTheme(ScalarTheme.Mars)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });*/
    app.MapScalarApiReference();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

// IMPORTANT: CORS policy should be configured since frontend runs on different port (Vite)
app.UseCors(policy => policy
    .WithOrigins("http://localhost:5173") // Adjust this to match Agent-1's Vite port
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
