using ShipmentManagement.Application;
using ShipmentManagement.Infrastructure;
using ShipmentManagement.API.Middleware;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Domain.Entities;
using ShipmentManagement.Domain.Enums;
using ShipmentManagement.Infrastructure.Persistence;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Replace default logging with Serilog (configured from appsettings.json)
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Disable default logging providers
builder.Logging.ClearProviders();

// Use port 2026
//builder.WebHost.UseUrls("http://*:2026");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi("ShipmentManagement"); // .NET 9 default openapi generator

// Add Clean Arch Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>() ?? [];
if (allowedOrigins.Any())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowConfiguredOrigins", policy =>
             policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
    });
}
var app = builder.Build();

// Auto-migrate and seed dummy data
using (var scope = app.Services.CreateScope())
{
    /*var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
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
    }*/
}

if (/*app.Environment.IsDevelopment()*/true)
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
// 1. Force HTTPS
app.UseHttpsRedirection();
// 2. Enable standard static file serving (for js, css, images)
app.UseDefaultFiles(); // Looks for index.html
app.UseStaticFiles();
if (allowedOrigins.Any())
{
    // IMPORTANT: CORS policy should be configured since frontend runs on different port (Vite)
    app.UseCors("AllowConfiguredOrigins");
}
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// 3. THE KEY PART: Fallback to React
// If the request doesn't match an API controller or a physical file, 
// send index.html so React Router takes over.
app.MapFallbackToFile("index.html");
app.Run();
