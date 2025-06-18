using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using NihongoSekai.Web.ViewModels;
using System.Text;

namespace NihongoSekai.Web.Services
{
    public interface IBuilderIoClientService
    {
        Task<BuilderPageViewModel?> GetPageAsync(string slug, Dictionary<string, object>? context = null);
        Task<T?> GetContentAsync<T>(string model, string query = "") where T : class;
        Task<List<T>> GetContentListAsync<T>(string model, int limit = 10, string query = "") where T : class;
        Task<bool> UpdateContentAsync(string model, string id, object data);
        Task<string?> CreateContentAsync(string model, object data);
        Task<bool> DeleteContentAsync(string model, string id);
    }

    public class BuilderIoClientService : IBuilderIoClientService
    {
        private readonly HttpClient _httpClient;
        private readonly BuilderIoOptions _options;
        private readonly ILogger<BuilderIoClientService> _logger;

        public BuilderIoClientService(
            HttpClient httpClient, 
            IOptions<BuilderIoOptions> options,
            ILogger<BuilderIoClientService> logger)
        {
            _httpClient = httpClient;
            _options = options.Value;
            _logger = logger;

            ConfigureHttpClient();
        }

        private void ConfigureHttpClient()
        {
            _httpClient.BaseAddress = new Uri(_options.BaseUrl);
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_options.PublicApiKey}");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "NihongoSekai/1.0");
        }

        public async Task<BuilderPageViewModel?> GetPageAsync(string slug, Dictionary<string, object>? context = null)
        {
            try
            {
                if (string.IsNullOrEmpty(_options.PublicApiKey))
                {
                    _logger.LogWarning("Builder.io API key not configured. Using mock data.");
                    return GetMockPage(slug);
                }

                var url = $"/content/page?apiKey={_options.PublicApiKey}&url={Uri.EscapeDataString($"/{slug}")}";
                
                if (context != null && context.Any())
                {
                    var contextJson = JsonConvert.SerializeObject(context);
                    url += $"&userAttributes={Uri.EscapeDataString(contextJson)}";
                }

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Failed to fetch page '{slug}' from Builder.io: {response.StatusCode}");
                    return GetMockPage(slug);
                }

                var content = await response.Content.ReadAsStringAsync();
                var builderResponse = JsonConvert.DeserializeObject<BuilderResponse<BuilderPageData>>(content);

                if (builderResponse?.Results?.Any() != true)
                {
                    return GetMockPage(slug);
                }

                return MapToPageViewModel(builderResponse.Results.First(), slug);
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
                if (string.IsNullOrEmpty(_options.PublicApiKey))
                {
                    return default(T);
                }

                var url = $"/content/{model}?apiKey={_options.PublicApiKey}&limit=1";
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

        public async Task<List<T>> GetContentListAsync<T>(string model, int limit = 10, string query = "") where T : class
        {
            try
            {
                if (string.IsNullOrEmpty(_options.PublicApiKey))
                {
                    return new List<T>();
                }

                var url = $"/content/{model}?apiKey={_options.PublicApiKey}&limit={limit}";
                if (!string.IsNullOrEmpty(query))
                {
                    url += $"&{query}";
                }

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Failed to fetch content list '{model}' from Builder.io: {response.StatusCode}");
                    return new List<T>();
                }

                var content = await response.Content.ReadAsStringAsync();
                var builderResponse = JsonConvert.DeserializeObject<BuilderResponse<T>>(content);

                return builderResponse?.Results ?? new List<T>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching content list '{model}' from Builder.io");
                return new List<T>();
            }
        }

        public async Task<bool> UpdateContentAsync(string model, string id, object data)
        {
            try
            {
                if (string.IsNullOrEmpty(_options.PrivateApiKey))
                {
                    _logger.LogWarning("Builder.io private API key not configured for write operations");
                    return false;
                }

                var url = $"/content/{model}/{id}?apiKey={_options.PrivateApiKey}";
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PutAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Failed to update content '{model}/{id}': {response.StatusCode}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating content '{model}/{id}'");
                return false;
            }
        }

        public async Task<string?> CreateContentAsync(string model, object data)
        {
            try
            {
                if (string.IsNullOrEmpty(_options.PrivateApiKey))
                {
                    _logger.LogWarning("Builder.io private API key not configured for write operations");
                    return null;
                }

                var url = $"/content/{model}?apiKey={_options.PrivateApiKey}";
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Failed to create content in '{model}': {response.StatusCode}");
                    return null;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
                return result?.id?.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error creating content in '{model}'");
                return null;
            }
        }

        public async Task<bool> DeleteContentAsync(string model, string id)
        {
            try
            {
                if (string.IsNullOrEmpty(_options.PrivateApiKey))
                {
                    _logger.LogWarning("Builder.io private API key not configured for write operations");
                    return false;
                }

                var url = $"/content/{model}/{id}?apiKey={_options.PrivateApiKey}";
                var response = await _httpClient.DeleteAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Failed to delete content '{model}/{id}': {response.StatusCode}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting content '{model}/{id}'");
                return false;
            }
        }

        private BuilderPageViewModel MapToPageViewModel(BuilderPageData pageData, string slug)
        {
            return new BuilderPageViewModel
            {
                Id = pageData.Id,
                Name = pageData.Name,
                Title = pageData.Data?.Title ?? $"{slug} - Nihongo Sekai",
                Description = pageData.Data?.Description,
                Slug = slug,
                Sections = pageData.Data?.Blocks?.Select(MapToSectionViewModel).ToList() ?? new List<PageSectionViewModel>(),
                CustomFields = pageData.Data?.CustomFields ?? new Dictionary<string, object>()
            };
        }

        private PageSectionViewModel MapToSectionViewModel(BuilderBlock block)
        {
            return new PageSectionViewModel
            {
                Id = block.Id,
                Component = block.Component?.Name ?? "DefaultContent",
                Properties = block.Component?.Options ?? new Dictionary<string, object>(),
                Children = block.Children?.Select(MapToSectionViewModel).ToList() ?? new List<PageSectionViewModel>()
            };
        }

        private BuilderPageViewModel GetMockPage(string slug)
        {
            // Enhanced mock data based on slug
            return slug.ToLower() switch
            {
                "" or "home" => new BuilderPageViewModel
                {
                    Id = "home",
                    Name = "Home Page",
                    Title = "Learn Japanese - Nihongo Sekai",
                    Description = "Master Japanese through immersive conversations and cultural insights",
                    Slug = "home",
                    Sections = new List<PageSectionViewModel>
                    {
                        new PageSectionViewModel
                        {
                            Component = "HeroSection",
                            Properties = new Dictionary<string, object>
                            {
                                ["title"] = "Master Japanese with Native Speakers",
                                ["subtitle"] = "Join our immersive learning community and discover the beauty of Japanese language and culture",
                                ["buttonText"] = "Start Learning Today",
                                ["buttonLink"] = "/courses",
                                ["backgroundImage"] = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&h=600&fit=crop",
                                ["showStats"] = true
                            }
                        },
                        new PageSectionViewModel
                        {
                            Component = "FeaturedCourses",
                            Properties = new Dictionary<string, object>
                            {
                                ["title"] = "Featured Courses",
                                ["subtitle"] = "Start your Japanese journey with our most popular courses",
                                ["maxCourses"] = 3
                            }
                        },
                        new PageSectionViewModel
                        {
                            Component = "StatsGrid",
                            Properties = new Dictionary<string, object>
                            {
                                ["title"] = "Join Thousands of Successful Learners",
                                ["backgroundStyle"] = "light"
                            }
                        }
                    }
                },
                "courses" => new BuilderPageViewModel
                {
                    Id = "courses",
                    Name = "Courses Page",
                    Title = "Japanese Courses - All Levels",
                    Description = "Comprehensive Japanese courses for beginners to advanced learners",
                    Slug = "courses",
                    Sections = new List<PageSectionViewModel>
                    {
                        new PageSectionViewModel
                        {
                            Component = "PageHeader",
                            Properties = new Dictionary<string, object>
                            {
                                ["title"] = "Japanese Language Courses",
                                ["subtitle"] = "Choose from our comprehensive selection of courses designed for all skill levels"
                            }
                        },
                        new PageSectionViewModel
                        {
                            Component = "CourseFilters",
                            Properties = new Dictionary<string, object>()
                        },
                        new PageSectionViewModel
                        {
                            Component = "CourseCatalog",
                            Properties = new Dictionary<string, object>
                            {
                                ["showPagination"] = true,
                                ["itemsPerPage"] = 12
                            }
                        }
                    }
                },
                "about" => new BuilderPageViewModel
                {
                    Id = "about",
                    Name = "About Page",
                    Title = "About Nihongo Sekai",
                    Description = "Learn about our mission to make Japanese accessible to everyone",
                    Slug = "about",
                    Sections = new List<PageSectionViewModel>
                    {
                        new PageSectionViewModel
                        {
                            Component = "PageHeader",
                            Properties = new Dictionary<string, object>
                            {
                                ["title"] = "About Nihongo Sekai",
                                ["subtitle"] = "Bridging cultures through language learning"
                            }
                        },
                        new PageSectionViewModel
                        {
                            Component = "ContentSection",
                            Properties = new Dictionary<string, object>
                            {
                                ["content"] = "Our mission is to make Japanese language and culture accessible to learners worldwide through innovative technology and authentic cultural experiences."
                            }
                        }
                    }
                },
                _ => new BuilderPageViewModel
                {
                    Id = slug,
                    Name = $"{slug} Page",
                    Title = $"{slug} - Nihongo Sekai",
                    Slug = slug,
                    Sections = new List<PageSectionViewModel>
                    {
                        new PageSectionViewModel
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
            };
        }
    }

    // Configuration Options
    public class BuilderIoOptions
    {
        public const string SectionName = "BuilderIO";

        public string PublicApiKey { get; set; } = string.Empty;
        public string PrivateApiKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = "https://cdn.builder.io/api/v1";
        public string SpaceId { get; set; } = string.Empty;
        public bool EnablePreview { get; set; } = false;
        public int CacheTimeout { get; set; } = 300; // 5 minutes
    }

    // Builder.io Response Models
    public class BuilderResponse<T>
    {
        public List<T> Results { get; set; } = new();
    }

    public class BuilderPageData
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public BuilderData? Data { get; set; }
    }

    public class BuilderData
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public List<BuilderBlock> Blocks { get; set; } = new();
        public Dictionary<string, object> CustomFields { get; set; } = new();
    }

    public class BuilderBlock
    {
        public string Id { get; set; } = string.Empty;
        public BuilderComponent? Component { get; set; }
        public List<BuilderBlock> Children { get; set; } = new();
    }

    public class BuilderComponent
    {
        public string Name { get; set; } = string.Empty;
        public Dictionary<string, object> Options { get; set; } = new();
    }
}
