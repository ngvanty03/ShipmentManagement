using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Application.DTOs.User;
using ShipmentManagement.Application.Interfaces;
using ShipmentManagement.Domain.Entities;
using DomainUser = ShipmentManagement.Domain.Entities.User;

namespace ShipmentManagement.Application.Commands.User.CreateUser;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDTO>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher<DomainUser> _passwordHasher;

    public CreateUserCommandHandler(IApplicationDbContext context, IPasswordHasher<DomainUser> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDTO> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        // Check for duplicate email
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser != null)
        {
            throw new InvalidOperationException($"A user with email '{request.Email}' already exists.");
        }

        var user = new DomainUser
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsActive = request.IsActive ?? true,
            Role = Domain.Enums.Role.Customer // Default role for new users
        };

        // Hash the password using PasswordHasher<User>
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new UserDTO
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsActive = user.IsActive
        };
    }
}
