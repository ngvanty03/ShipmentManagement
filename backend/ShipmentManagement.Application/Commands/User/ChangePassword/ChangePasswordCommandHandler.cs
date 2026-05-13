using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Application.Interfaces;
using DomainUser = ShipmentManagement.Domain.Entities.User;

namespace ShipmentManagement.Application.Commands.User.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher<DomainUser> _passwordHasher;

    public ChangePasswordCommandHandler(IApplicationDbContext context, IPasswordHasher<DomainUser> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<Unit> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException($"User with ID '{request.Id}' was not found.");
        }

        // Hash the new password using PasswordHasher<User>
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
