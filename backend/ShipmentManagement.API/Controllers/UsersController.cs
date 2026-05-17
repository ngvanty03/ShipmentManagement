using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShipmentManagement.Application.Commands.User.ChangePassword;
using ShipmentManagement.Application.Commands.User.CreateUser;
using ShipmentManagement.Application.Commands.User.DeleteUser;
using ShipmentManagement.Application.Commands.User.UpdateUser;
using ShipmentManagement.Application.DTOs.Common;
using ShipmentManagement.Application.DTOs.User;
using ShipmentManagement.Application.Queries.User.GetUsers;
using ShipmentManagement.Application.Queries.User.GetUsersById;

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
    [Authorize]
    public async Task<ActionResult<PagedResult<UserDTO>>> GetUsers([FromQuery] GetUsersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDTO>> GetUserById(Guid id)
    {
        GetUsersByIdQuery query = new GetUsersByIdQuery() { Id=id.ToString() };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<UserDTO>> CreateUser(CreateUserRequest request)
    {
        var command = new CreateUserCommand(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.IsActive
        );

        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetUsers), new { }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDTO>> UpdateUser(Guid id, UpdateUserRequest request)
    {
        var command = new UpdateUserCommand(
            id,
            request.Email,
            request.FirstName,
            request.LastName,
            request.IsActive
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        await _mediator.Send(new DeleteUserCommand(id));
        return NoContent();
    }

    [HttpPut("{id:guid}/change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(Guid id, ChangePasswordRequest request)
    {
        await _mediator.Send(new ChangePasswordCommand(id, request.Email, request.Password));
        return NoContent();
    }
}
