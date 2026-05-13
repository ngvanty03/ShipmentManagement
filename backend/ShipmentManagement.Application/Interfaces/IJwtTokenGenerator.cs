using ShipmentManagement.Domain.Entities;

namespace ShipmentManagement.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}
