using MediatR;
using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Application.DTOs.Common;
using ShipmentManagement.Application.DTOs.User;
using ShipmentManagement.Application.Interfaces;

namespace ShipmentManagement.Application.Queries.User.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, PagedResult<UserDTO>>
{
    private readonly IApplicationDbContext _context;

    public GetUsersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<UserDTO>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Users.AsNoTracking().AsQueryable();

        // 1. Filtering
        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            query = query.Where(x => x.Email.Contains(request.Email));
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(x => x.IsActive == request.IsActive.Value);
        }

        // 2. Total Count
        var totalCount = await query.CountAsync(cancellationToken);

        // 3. Sorting
        var isDescending = request.SortDirection?.ToLower() == "desc";
        
        query = request.SortBy?.ToLower() switch
        {
            "email" => isDescending ? query.OrderByDescending(x => x.Email) : query.OrderBy(x => x.Email),
            "firstname" => isDescending ? query.OrderByDescending(x => x.FirstName) : query.OrderBy(x => x.FirstName),
            "lastname" => isDescending ? query.OrderByDescending(x => x.LastName) : query.OrderBy(x => x.LastName),
            "isactive" => isDescending ? query.OrderByDescending(x => x.IsActive) : query.OrderBy(x => x.IsActive),
            _ => isDescending ? query.OrderByDescending(x => x.Id) : query.OrderBy(x => x.Id) // Default sorting
        };

        // 4. Pagination
        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new UserDTO
            {
                Id = x.Id,
                Email = x.Email,
                FirstName = x.FirstName,
                LastName = x.LastName,
                IsActive = x.IsActive
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<UserDTO>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
