using MediatR;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Application.DTOs.Common;
using ShipmentManagement.Application.DTOs.User;
using ShipmentManagement.Application.Interfaces;
using ShipmentManagement.Application.Queries.User.GetUsersById;

namespace ShipmentManagement.Application.Queries.User.GetUsers;

public class GetUsersIdHandler : IRequestHandler<GetUsersByIdQuery, UserDTO>
{
    private readonly IApplicationDbContext _context;

    public GetUsersIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDTO> Handle(GetUsersByIdQuery request, CancellationToken cancellationToken)
    {
        var query = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == Guid.Parse(request.Id));
        return new UserDTO()
        {
            Id=query.Id,
            Email = query.Email,
            FirstName= query.FirstName,
            LastName= query.LastName,
            IsActive= query.IsActive
        };
    }
}
