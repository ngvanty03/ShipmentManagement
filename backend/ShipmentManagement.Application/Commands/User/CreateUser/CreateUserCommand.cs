using MediatR;
using ShipmentManagement.Application.DTOs.User;

namespace ShipmentManagement.Application.Commands.User.CreateUser;

public record CreateUserCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    bool? IsActive
) : IRequest<UserDTO>;
