using MediatR;
using Microsoft.AspNetCore.Mvc;
using ShipmentManagement.Application.Commands.Auth.Login;
using ShipmentManagement.Application.Commands.Auth.RefreshToken;
using ShipmentManagement.Application.DTOs.Auth;

namespace ShipmentManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var result = await _mediator.Send(new LoginCommand(request.Email, request.Password));

        // Set refreshToken in HttpOnly cookie
        SetRefreshTokenCookie(result.RefreshToken);

        // Return accessToken in response body
        return Ok(new AuthResponse
        {
            AccessToken = result.AccessToken,
            User = result.Profile
        });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("No refresh token found in cookies.");
        }

        var result = await _mediator.Send(new RefreshTokenCommand(refreshToken));

        // Rotate refreshToken cookie
        SetRefreshTokenCookie(result.RefreshToken);

        // Return new accessToken in response body
        return Ok(new AuthResponse
        {
            AccessToken = result.AccessToken,
            User = result.Profile
        });
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            MaxAge = TimeSpan.FromDays(7)
        });
    }
}
