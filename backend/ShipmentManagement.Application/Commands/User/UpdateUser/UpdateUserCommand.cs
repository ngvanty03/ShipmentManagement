using MediatR;
using ShipmentManagement.Application.DTOs.User;

namespace ShipmentManagement.Application.Commands.User.UpdateUser;

public record UpdateUserCommand(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    bool? IsActive
) : IRequest<UserDTO>;
