using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Application.DTOs.Auth;
using ShipmentManagement.Application.Interfaces;
using DomainUser = ShipmentManagement.Domain.Entities.User;

namespace ShipmentManagement.Application.Commands.Auth.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher<DomainUser> _passwordHasher;

    public LoginCommandHandler(
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher<DomainUser> passwordHasher)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }
        // Verify password using PasswordHasher<User>
        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.RefreshToken = refreshToken.Item1;
        user.RefreshTokenExpiryTime = refreshToken.Item2;
        
        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResult
        {
            AccessToken = accessToken,
            RefreshToken = user.RefreshToken,
            Profile = new UserProfileResponse
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString()
            }
        };
    }
}
