using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NihongoSekai.Web.Data;
using NihongoSekai.Web.Models;
using NihongoSekai.Web.Services;
using Microsoft.AspNetCore.Authentication.Google;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configure ASP.NET Identity
builder.Services.AddIdentity<Account, IdentityRole<int>>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false; // Set to true in production
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Configure Google Authentication
builder.Services.AddAuthentication()
    .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
    {
        options.ClientId = builder.Configuration["Google:ClientId"] ?? "";
        options.ClientSecret = builder.Configuration["Google:ClientSecret"] ?? "";
        options.SaveTokens = true;
        
        // Request additional scopes for Google Calendar
        options.Scope.Add("https://www.googleapis.com/auth/calendar");
        options.Scope.Add("https://www.googleapis.com/auth/calendar.events");
    });

// Configure cookie settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
});

// Configure Builder.io options
builder.Services.Configure<BuilderIoOptions>(
    builder.Configuration.GetSection(BuilderIoOptions.SectionName));

// Add MVC with view component support
builder.Services.AddControllersWithViews()
    .AddViewComponentsAsServices();

// Add memory cache for Builder.io content
builder.Services.AddMemoryCache();

// Add HttpClient for Builder.io (replaced TypeScript SDK)
builder.Services.AddHttpClient<IBuilderIoClientService, BuilderIoClientService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "NihongoSekai/1.0 (ASP.NET Core)");
});

// Register custom services (replacing TypeScript services)
builder.Services.AddScoped<IBuilderIoClientService, BuilderIoClientService>();
builder.Services.AddScoped<IGoogleService, GoogleService>();

// Add response compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// Add response caching
builder.Services.AddResponseCaching();

// Add session support
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Add response compression and caching
app.UseResponseCompression();
app.UseResponseCaching();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

// Configure specific routes (before catch-all)
app.MapControllerRoute(
    name: "admin",
    pattern: "admin/{action=Index}/{id?}",
    defaults: new { controller = "Admin" });

app.MapControllerRoute(
    name: "account",
    pattern: "Account/{action=Login}/{id?}",
    defaults: new { controller = "Account" });

app.MapControllerRoute(
    name: "courses",
    pattern: "courses/{action=Index}/{id?}",
    defaults: new { controller = "Courses" });

app.MapControllerRoute(
    name: "classrooms",
    pattern: "classrooms/{action=Index}/{id?}",
    defaults: new { controller = "Classrooms" });

app.MapControllerRoute(
    name: "teachers",
    pattern: "teachers/{action=Index}/{id?}",
    defaults: new { controller = "Teachers" });

app.MapControllerRoute(
    name: "api",
    pattern: "api/{controller}/{action=Index}/{id?}");

// Catch-all route for Builder.io pages (must be last)
// This replaces client-side routing from React
app.MapControllerRoute(
    name: "builderPages",
    pattern: "{**slug}",
    defaults: new { controller = "BasePage", action = "Render" });

// Initialize database
try
{
    await AppDbInitializer.InitializeAsync(app.Services);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred while initializing the database.");
}

app.Run();

// Make the implicit Program class public for testing
public partial class Program { }
