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
    public async Task<ActionResult<UserProfileResponse>> Login(LoginRequest request)
    {
        var result = await _mediator.Send(new LoginCommand(request.Email, request.Password));
        SetTokensInsideCookie(result.AccessToken, result.RefreshToken);
        return Ok(result.Profile);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<UserProfileResponse>> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("No refresh token found in cookies.");
        }

        var result = await _mediator.Send(new RefreshTokenCommand(refreshToken));
        SetTokensInsideCookie(result.AccessToken, result.RefreshToken);
        return Ok(result.Profile);
    }

    private void SetTokensInsideCookie(string accessToken, string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Should be true in production, using HTTPS
            SameSite = SameSiteMode.Strict,
            Path = "/"
        };

        // Access token (15 mins)
        cookieOptions.MaxAge = TimeSpan.FromMinutes(15);
        Response.Cookies.Append("accessToken", accessToken, cookieOptions);

        // Refresh token (7 days)
        cookieOptions.MaxAge = TimeSpan.FromDays(7);
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}
