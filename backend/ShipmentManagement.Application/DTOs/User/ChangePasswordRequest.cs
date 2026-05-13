namespace ShipmentManagement.Application.DTOs.User;

public class ChangePasswordRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
