using Microsoft.AspNetCore.Mvc;
using NihongoSekai.Web.Services;
using NihongoSekai.Web.ViewModels;
using Microsoft.Extensions.Caching.Memory;

namespace NihongoSekai.Web.Controllers
{
    [Route("")]
    public class BasePageController : Controller
    {
        private readonly IBuilderIoClientService _builderService;
        private readonly IMemoryCache _cache;
        private readonly ILogger<BasePageController> _logger;

        public BasePageController(
            IBuilderIoClientService builderService,
            IMemoryCache cache,
            ILogger<BasePageController> logger)
        {
            _builderService = builderService;
            _cache = cache;
            _logger = logger;
        }

        [HttpGet("{**slug}")]
        public async Task<IActionResult> Render(string slug = "")
        {
            try
            {
                // Handle empty slug as home page
                if (string.IsNullOrEmpty(slug))
                    slug = "home";

                // Normalize slug
                slug = slug.Trim('/').ToLower();

                // Check if this should be handled by a specific controller
                if (ShouldRedirectToSpecificController(slug))
                {
                    return RedirectToAction("Index", GetControllerName(slug));
                }

                // Try to get page from cache first
                var cacheKey = $"builder_page_{slug}";
                if (!_cache.TryGetValue(cacheKey, out BuilderPageViewModel? page))
                {
                    // Create user context for personalized content
                    var context = await CreateUserContextAsync();

                    // Fetch page content from Builder.io
                    page = await _builderService.GetPageAsync(slug, context);
                    
                    if (page == null)
                    {
                        _logger.LogWarning($"Page not found for slug: {slug}");
                        return NotFound();
                    }

                    // Cache the page for 5 minutes
                    _cache.Set(cacheKey, page, TimeSpan.FromMinutes(5));
                }

                // Set page metadata
                ViewBag.Title = page.Title;
                ViewBag.Description = page.Description;
                ViewBag.Slug = slug;

                // Add structured data for SEO
                ViewBag.StructuredData = CreateStructuredData(page);

                return View("~/Views/Shared/BuilderPage.cshtml", page);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error rendering page for slug: {slug}");
                return StatusCode(500, "An error occurred while loading the page.");
            }
        }

        [HttpGet("preview/{**slug}")]
        public async Task<IActionResult> Preview(string slug = "")
        {
            // Preview mode - don't use cache and show draft content
            try
            {
                if (string.IsNullOrEmpty(slug))
                    slug = "home";

                slug = slug.Trim('/').ToLower();

                var context = await CreateUserContextAsync();
                context["preview"] = true;

                var page = await _builderService.GetPageAsync(slug, context);
                
                if (page == null)
                {
                    return NotFound("Preview page not found");
                }

                ViewBag.Title = $"[PREVIEW] {page.Title}";
                ViewBag.Description = page.Description;
                ViewBag.Slug = slug;
                ViewBag.IsPreview = true;

                return View("~/Views/Shared/BuilderPage.cshtml", page);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error rendering preview page for slug: {slug}");
                return StatusCode(500, "An error occurred while loading the preview page.");
            }
        }

        private bool ShouldRedirectToSpecificController(string slug)
        {
            var specificRoutes = new[]
            {
                "account", "login", "register", "logout",
                "admin", "dashboard",
                "api"
            };

            return specificRoutes.Any(route => slug.StartsWith(route, StringComparison.OrdinalIgnoreCase));
        }

        private string GetControllerName(string slug)
        {
            return slug.Split('/')[0] switch
            {
                "account" => "Account",
                "admin" => "Admin",
                "dashboard" => "Dashboard",
                _ => "Home"
            };
        }

        private async Task<Dictionary<string, object>> CreateUserContextAsync()
        {
            var context = new Dictionary<string, object>
            {
                ["userAgent"] = Request.Headers["User-Agent"].ToString(),
                ["timestamp"] = DateTime.UtcNow,
                ["isAuthenticated"] = User.Identity?.IsAuthenticated ?? false
            };

            if (User.Identity?.IsAuthenticated == true)
            {
                context["userId"] = User.FindFirst("sub")?.Value ?? "";
                context["userRole"] = User.FindFirst("role")?.Value ?? "";
                context["userName"] = User.Identity.Name ?? "";
            }

            // Add device type detection
            var userAgent = Request.Headers["User-Agent"].ToString();
            context["deviceType"] = GetDeviceType(userAgent);

            // Add geographic context if available
            var clientIP = GetClientIP();
            if (!string.IsNullOrEmpty(clientIP))
            {
                context["clientIP"] = clientIP;
            }

            return context;
        }

        private string GetDeviceType(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent))
                return "unknown";

            userAgent = userAgent.ToLower();

            if (userAgent.Contains("mobile") || userAgent.Contains("android") || userAgent.Contains("iphone"))
                return "mobile";
            if (userAgent.Contains("tablet") || userAgent.Contains("ipad"))
                return "tablet";
            
            return "desktop";
        }

        private string GetClientIP()
        {
            // Try to get real client IP from various headers
            var ipHeaders = new[]
            {
                "CF-Connecting-IP", // Cloudflare
                "X-Forwarded-For", // General proxy
                "X-Real-IP", // Nginx
                "X-Client-IP" // Other proxies
            };

            foreach (var header in ipHeaders)
            {
                if (Request.Headers.TryGetValue(header, out var value) && !string.IsNullOrEmpty(value))
                {
                    return value.ToString().Split(',')[0].Trim();
                }
            }

            return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "";
        }

        private object CreateStructuredData(BuilderPageViewModel page)
        {
            return new
            {
                context = "https://schema.org",
                type = "WebPage",
                name = page.Title,
                description = page.Description,
                url = $"{Request.Scheme}://{Request.Host}/{page.Slug}",
                isPartOf = new
                {
                    type = "WebSite",
                    name = "Nihongo Sekai",
                    url = $"{Request.Scheme}://{Request.Host}",
                    description = "Japanese Communication & Culture Learning Platform"
                },
                publisher = new
                {
                    type = "Organization",
                    name = "Nihongo Sekai",
                    url = $"{Request.Scheme}://{Request.Host}"
                }
            };
        }

        // API endpoint for Builder.io webhook
        [HttpPost("api/builder/webhook")]
        public async Task<IActionResult> BuilderWebhook([FromBody] object payload)
        {
            try
            {
                _logger.LogInformation("Received Builder.io webhook");

                // Clear cache when content is updated
                if (_cache is MemoryCache memoryCache)
                {
                    // Get all cached keys that start with "builder_page_"
                    var field = typeof(MemoryCache).GetField("_coherentState", 
                        System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                    
                    if (field?.GetValue(memoryCache) is object coherentState)
                    {
                        var entriesCollection = coherentState.GetType()
                            .GetProperty("EntriesCollection", System.Reflection.BindingFlags.NonPublic);
                        
                        if (entriesCollection?.GetValue(coherentState) is IDictionary entries)
                        {
                            var keysToRemove = new List<object>();
                            foreach (DictionaryEntry entry in entries)
                            {
                                if (entry.Key.ToString()?.StartsWith("builder_page_") == true)
                                {
                                    keysToRemove.Add(entry.Key);
                                }
                            }

                            foreach (var key in keysToRemove)
                            {
                                memoryCache.Remove(key);
                            }
                        }
                    }
                }

                return Ok(new { status = "success", message = "Cache cleared" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Builder.io webhook");
                return StatusCode(500);
            }
        }
    }
}
