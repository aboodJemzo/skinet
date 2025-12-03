using System;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnAuthorized()
    {
        return Unauthorized();
    }
    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("not a good request");
    }
    [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }
    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDTO product)// the idea here is, we just gonna send an empty or a request to this endpoint with an empty body just to see what happen with our validation
    {
        return Ok();
    }
    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("this is a text exception");
    }
}
