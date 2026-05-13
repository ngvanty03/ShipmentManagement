using MediatR;

namespace ShipmentManagement.Application.Commands.User.DeleteUser;

public record DeleteUserCommand(Guid Id) : IRequest<Unit>;
