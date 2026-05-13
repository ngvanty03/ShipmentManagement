using ShipmentManagement.Application.DTOs.Auth;

namespace ShipmentManagement.Application.Commands.Auth.RefreshToken;

public class RefreshTokenResult
{
    public UserProfileResponse Profile { get; set; } = null!;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
