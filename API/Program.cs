using API.Middleware;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
    var connString = builder.Configuration.GetConnectionString("Redis") ?? throw new Exception("Cannot get redis connection string");
    var configuration = ConfigurationOptions.Parse(connString, true);
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartService, CartService>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>().AddEntityFrameworkStores<StoreContext>();
builder.Services.AddScoped<IPaymentService, PaymentService>();


var app = builder.Build();
app.MapGroup("api").MapIdentityApi<AppUser>(); // now if we need to access anything now we have to add before it "api" like "api/login"

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>(); // this needs to live at the top of our Http request pipeline 

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()//"AllowCredentials()" this method allow us to send up a cookie from a client 
                                                                       //on a different domain to enable this functionality to work when we do authenticate with our client
.WithOrigins("http://localhost:4200", "https://localhost:4200"));

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
