using ShipmentManagement.Application.DTOs.Auth;

namespace ShipmentManagement.Application.Commands.Auth.Login;

public class LoginResult
{
    public UserProfileResponse Profile { get; set; } = null!;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
