using ShipmentManagement.Application.DTOs.Auth;

namespace ShipmentManagement.Application.DTOs.Auth;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public UserProfileResponse User { get; set; } = null!;
}
