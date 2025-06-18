using Newtonsoft.Json;
using System.Text;

namespace NihongoSekai.Web.Services
{
    public interface IBuilderService
    {
        Task<BuilderPage?> GetPageAsync(string slug);
        Task<T?> GetContentAsync<T>(string model, string query = "") where T : class;
    }

    public class BuilderService : IBuilderService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<BuilderService> _logger;

        public BuilderService(HttpClient httpClient, IConfiguration configuration, ILogger<BuilderService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;

            var apiKey = _configuration["BuilderIO:ApiKey"];
            var baseUrl = _configuration["BuilderIO:BaseUrl"];

            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogWarning("Builder.io API key not configured. Using mock data.");
                return;
            }

            _httpClient.BaseAddress = new Uri(baseUrl ?? "https://cdn.builder.io/api/v1");
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        }

        public async Task<BuilderPage?> GetPageAsync(string slug)
        {
            try
            {
                var apiKey = _configuration["BuilderIO:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    return GetMockPage(slug);
                }

                var url = $"/content/page?apiKey={apiKey}&url={Uri.EscapeDataString($"/{slug}")}";
                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Failed to fetch page '{slug}' from Builder.io: {response.StatusCode}");
                    return GetMockPage(slug);
                }

                var content = await response.Content.ReadAsStringAsync();
                var builderResponse = JsonConvert.DeserializeObject<BuilderResponse<BuilderPage>>(content);

                return builderResponse?.Results?.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching page '{slug}' from Builder.io");
                return GetMockPage(slug);
            }
        }

        public async Task<T?> GetContentAsync<T>(string model, string query = "") where T : class
        {
            try
            {
                var apiKey = _configuration["BuilderIO:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    return default(T);
                }

                var url = $"/content/{model}?apiKey={apiKey}";
                if (!string.IsNullOrEmpty(query))
                {
                    url += $"&{query}";
                }

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Failed to fetch content model '{model}' from Builder.io: {response.StatusCode}");
                    return default(T);
                }

                var content = await response.Content.ReadAsStringAsync();
                var builderResponse = JsonConvert.DeserializeObject<BuilderResponse<T>>(content);

                return builderResponse?.Results?.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching content model '{model}' from Builder.io");
                return default(T);
            }
        }

        private BuilderPage GetMockPage(string slug)
        {
            // Return mock page data for development
            return slug.ToLower() switch
            {
                "" or "home" => new BuilderPage
                {
                    Id = "home",
                    Name = "Home Page",
                    Data = new BuilderPageData
                    {
                        Title = "Nihongo Sekai - Japanese Learning Platform",
                        Sections = new List<BuilderSection>
                        {
                            new BuilderSection
                            {
                                Component = "HeroSection",
                                Properties = new Dictionary<string, object>
                                {
                                    ["title"] = "Learn Japanese with Native Speakers",
                                    ["subtitle"] = "Master Japanese through immersive conversations, cultural insights, and personalized learning paths.",
                                    ["buttonText"] = "Start Learning Today",
                                    ["buttonLink"] = "/courses",
                                    ["backgroundImage"] = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=600&fit=crop"
                                }
                            },
                            new BuilderSection
                            {
                                Component = "FeaturedCourses",
                                Properties = new Dictionary<string, object>
                                {
                                    ["title"] = "Featured Courses",
                                    ["subtitle"] = "Start your Japanese journey with our most popular courses"
                                }
                            },
                            new BuilderSection
                            {
                                Component = "StatsSection",
                                Properties = new Dictionary<string, object>
                                {
                                    ["stats"] = new[]
                                    {
                                        new { label = "Students", value = "10,000+" },
                                        new { label = "Courses", value = "150+" },
                                        new { label = "Teachers", value = "50+" },
                                        new { label = "Success Rate", value = "95%" }
                                    }
                                }
                            }
                        }
                    }
                },
                "courses" => new BuilderPage
                {
                    Id = "courses",
                    Name = "Courses Page",
                    Data = new BuilderPageData
                    {
                        Title = "Japanese Courses - Nihongo Sekai",
                        Sections = new List<BuilderSection>
                        {
                            new BuilderSection
                            {
                                Component = "PageHeader",
                                Properties = new Dictionary<string, object>
                                {
                                    ["title"] = "Japanese Language Courses",
                                    ["subtitle"] = "Choose from our comprehensive selection of Japanese courses designed for all skill levels."
                                }
                            },
                            new BuilderSection
                            {
                                Component = "CourseFilters",
                                Properties = new Dictionary<string, object>()
                            },
                            new BuilderSection
                            {
                                Component = "CourseCatalog",
                                Properties = new Dictionary<string, object>()
                            }
                        }
                    }
                },
                _ => new BuilderPage
                {
                    Id = slug,
                    Name = $"{slug} Page",
                    Data = new BuilderPageData
                    {
                        Title = $"{slug} - Nihongo Sekai",
                        Sections = new List<BuilderSection>
                        {
                            new BuilderSection
                            {
                                Component = "DefaultContent",
                                Properties = new Dictionary<string, object>
                                {
                                    ["title"] = $"Welcome to {slug}",
                                    ["content"] = "This page is managed through Builder.io CMS."
                                }
                            }
                        }
                    }
                }
            };
        }
    }

    // Builder.io data models
    public class BuilderResponse<T>
    {
        public List<T>? Results { get; set; }
    }

    public class BuilderPage
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public BuilderPageData Data { get; set; } = new();
    }

    public class BuilderPageData
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<BuilderSection> Sections { get; set; } = new();
    }

    public class BuilderSection
    {
        public string Component { get; set; } = string.Empty;
        public Dictionary<string, object> Properties { get; set; } = new();
    }
}
