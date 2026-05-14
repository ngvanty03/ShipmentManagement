using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipmentManagement.Application.Commands.Auth.Login;
using ShipmentManagement.Application.DTOs.Auth;
using ShipmentManagement.Application.Interfaces;

namespace ShipmentManagement.Application.Commands.Auth.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;


    public RefreshTokenCommandHandler(IApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator, ILogger<RefreshTokenCommandHandler> logger)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger= logger;
    }

    public async Task<RefreshTokenResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Call loggin RefreshTokenCommandHandler with RefreshToken:{request.RefreshToken}");
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken, cancellationToken);
        
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken.Item1;
        user.RefreshTokenExpiryTime = newRefreshToken.Item2;
        
        await _context.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResult
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
