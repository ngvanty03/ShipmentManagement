using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShipmentManagement.Application.DTOs.Common;
using ShipmentManagement.Application.DTOs.User;
using ShipmentManagement.Application.Queries.User.GetUsers;

namespace ShipmentManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
   // [Authorize] // Enforce authentication
    public async Task<ActionResult<PagedResult<UserDTO>>> GetUsers([FromQuery] GetUsersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
