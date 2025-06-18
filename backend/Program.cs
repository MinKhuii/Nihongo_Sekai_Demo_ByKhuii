using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using BuilderNihongoSekai.Api.Data;
using BuilderNihongoSekai.Api.Models;
using BuilderNihongoSekai.Api.Services;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Reflection;

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
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
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
        options.Scope.Add("https://www.googleapis.com/auth/calendar");
        options.Scope.Add("https://www.googleapis.com/auth/calendar.events");
    });

// Configure CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Builder.io options
builder.Services.Configure<BuilderIoOptions>(
    builder.Configuration.GetSection(BuilderIoOptions.SectionName));

// Add controllers and API services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Nihongo Sekai API",
        Version = "v1",
        Description = "API for Japanese Communication & Culture Learning Platform",
        Contact = new OpenApiContact
        {
            Name = "Nihongo Sekai Team",
            Email = "api@nihongosekai.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

    // Configure JWT Bearer token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Enable annotations
    c.EnableAnnotations();
});

// Add HttpClient for Builder.io
builder.Services.AddHttpClient<IBuilderIoClientService, BuilderIoClientService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("User-Agent", "BuilderNihongoSekai/1.0");
});

// Register custom services
builder.Services.AddScoped<IBuilderIoClientService, BuilderIoClientService>();
builder.Services.AddScoped<IGoogleService, GoogleService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IClassroomService, ClassroomService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();

// Add memory cache and response compression
builder.Services.AddMemoryCache();
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});
builder.Services.AddResponseCaching();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Nihongo Sekai API V1");
        c.RoutePrefix = "api/docs";
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseResponseCompression();
app.UseResponseCaching();

app.UseCors("AllowFrontend");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Serve frontend in production
if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

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

public partial class Program { }
