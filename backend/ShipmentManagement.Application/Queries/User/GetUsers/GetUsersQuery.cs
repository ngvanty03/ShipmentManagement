using MediatR;
using ShipmentManagement.Application.DTOs.Common;
using ShipmentManagement.Application.DTOs.User;

namespace ShipmentManagement.Application.Queries.User.GetUsers;

public class GetUsersQuery : IRequest<PagedResult<UserDTO>>
{
    public string? Email { get; set; }
    public bool? IsActive { get; set; }
    
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; } // "asc" or "desc"
}
