using MediatR;

namespace ShipmentManagement.Application.Commands.User.ChangePassword;

public record ChangePasswordCommand(Guid Id, string Email, string Password) : IRequest<Unit>;
