using System;
using System.Security.Authentication;
using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static async Task<AppUser> GetUserByEmail(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var userToReturn = await userManager.Users//here we get access to the user table in the DB
        .FirstOrDefaultAsync(x => x.Email == user.GetEmail());

        if (userToReturn == null) throw new AuthenticationException("User not found");

        return userToReturn;
    }

    public static async Task<AppUser> GetUserByEmailWithAddress(this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        var userToReturn = await userManager.Users//here we get access to the user table in the DB
        .Include(x => x.Address)
        .FirstOrDefaultAsync(x => x.Email == user.GetEmail());

        if (userToReturn == null) throw new AuthenticationException("User not found");

        return userToReturn;
    }

    public static string GetEmail(this ClaimsPrincipal user)//the claimprincipal in this case is the "User" object
    {
        var email = user.FindFirstValue(ClaimTypes.Email) ?? throw new AuthenticationException("Email claim not found");//cuz we r not in the controller we can't return Bad Request
        return email;
    }
}
