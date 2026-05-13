using MediatR;

namespace ShipmentManagement.Application.Commands.Auth.RefreshToken;

public record RefreshTokenCommand(string RefreshToken) : IRequest<RefreshTokenResult>;
