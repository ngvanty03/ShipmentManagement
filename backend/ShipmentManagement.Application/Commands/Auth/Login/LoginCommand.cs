using MediatR;

namespace ShipmentManagement.Application.Commands.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResult>;
