using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

try
{
    using var scope = app.Services.CreateScope();// "using var" means When the code we created by "scope" finishes, then the framework is gonna dispose 
    //any services that we used inside that code , cuz we r using this outside the context of dependency injection and when we use services inside or outside
    //the dependency injection then we have to create a scope  for the services to be created in and by using the using statement when it's outside the scope
    //then the framewrok is gonna tidy things up and dispose of anything we've used from the scope

    var services = scope.ServiceProvider; // we create or services (a reference to serviecs)
    var context = services.GetRequiredService<StoreContext>();//here we get our required service which is the context and link it with the "context"
    await context.Database.MigrateAsync();//this method applies any pending migration for the contextto the DB and will craete the DB if it's not existed 
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    throw;
}
app.Run();
