using System;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, RequestDelegate next) // the env give us the access to whether we're running in development or production
{
    public async Task InvokeAsync(HttpContext context)//this has to be called "InvokeAsync" only and it's gonna be used as a middleware 
                                                      //and our middleware when it passes the request on to this, it's gonna expect to see 
                                                      //a method inside here called "InvokeAsync"
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex, env);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception ex, IHostEnvironment env)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = env.IsDevelopment()
        ? new ApiErrorResponse(context.Response.StatusCode, ex.Message, ex.StackTrace)
        : new ApiErrorResponse(context.Response.StatusCode, ex.Message, "Internal server error");

        //here we make a json response that we can send back to the client
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);

        return context.Response.WriteAsync(json);
    }
}
