using MediatR;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Application.DTOs.User;
using ShipmentManagement.Application.Interfaces;

namespace ShipmentManagement.Application.Commands.User.UpdateUser;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDTO>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDTO> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID '{request.Id}' was not found.");
        }

        // Check for duplicate email (excluding the current user)
        var duplicateEmail = await _context.Users
            .AnyAsync(u => u.Email == request.Email && u.Id != request.Id, cancellationToken);

        if (duplicateEmail)
        {
            throw new InvalidOperationException($"A user with email '{request.Email}' already exists.");
        }

        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.IsActive = request.IsActive;
        // Password is NOT updated here

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
