using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;

namespace NihongoSekai.Web.Services
{
    public interface IGoogleService
    {
        Task<string> CreateCalendarEventAsync(string accessToken, CalendarEventRequest request);
        Task<List<CalendarEventResponse>> GetUpcomingEventsAsync(string accessToken, int maxResults = 10);
        Task<bool> DeleteCalendarEventAsync(string accessToken, string eventId);
    }

    public class GoogleService : IGoogleService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<GoogleService> _logger;

        public GoogleService(IConfiguration configuration, ILogger<GoogleService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> CreateCalendarEventAsync(string accessToken, CalendarEventRequest request)
        {
            try
            {
                var service = GetCalendarService(accessToken);
                
                var calendarEvent = new Event
                {
                    Summary = request.Title,
                    Description = request.Description,
                    Start = new EventDateTime
                    {
                        DateTime = request.StartTime,
                        TimeZone = "Asia/Tokyo"
                    },
                    End = new EventDateTime
                    {
                        DateTime = request.EndTime,
                        TimeZone = "Asia/Tokyo"
                    },
                    ConferenceData = new ConferenceData
                    {
                        CreateRequest = new CreateConferenceRequest
                        {
                            RequestId = Guid.NewGuid().ToString(),
                            ConferenceSolutionKey = new ConferenceSolutionKey
                            {
                                Type = "hangoutsMeet"
                            }
                        }
                    }
                };

                var insertRequest = service.Events.Insert(calendarEvent, "primary");
                insertRequest.ConferenceDataVersion = 1;
                
                var createdEvent = await insertRequest.ExecuteAsync();
                return createdEvent.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating calendar event");
                throw;
            }
        }

        public async Task<List<CalendarEventResponse>> GetUpcomingEventsAsync(string accessToken, int maxResults = 10)
        {
            try
            {
                var service = GetCalendarService(accessToken);
                
                var request = service.Events.List("primary");
                request.TimeMin = DateTime.UtcNow;
                request.ShowDeleted = false;
                request.SingleEvents = true;
                request.MaxResults = maxResults;
                request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

                var events = await request.ExecuteAsync();
                
                return events.Items?.Select(e => new CalendarEventResponse
                {
                    Id = e.Id,
                    Title = e.Summary,
                    Description = e.Description,
                    StartTime = e.Start?.DateTime ?? DateTime.MinValue,
                    EndTime = e.End?.DateTime ?? DateTime.MinValue,
                    MeetingUrl = e.ConferenceData?.EntryPoints?.FirstOrDefault(ep => ep.EntryPointType == "video")?.Uri
                }).ToList() ?? new List<CalendarEventResponse>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching calendar events");
                return new List<CalendarEventResponse>();
            }
        }

        public async Task<bool> DeleteCalendarEventAsync(string accessToken, string eventId)
        {
            try
            {
                var service = GetCalendarService(accessToken);
                await service.Events.Delete("primary", eventId).ExecuteAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting calendar event");
                return false;
            }
        }

        private CalendarService GetCalendarService(string accessToken)
        {
            var credential = GoogleCredential.FromAccessToken(accessToken);
            
            return new CalendarService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "Nihongo Sekai"
            });
        }
    }

    // Request/Response models
    public class CalendarEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public List<string> AttendeeEmails { get; set; } = new();
    }

    public class CalendarEventResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? MeetingUrl { get; set; }
    }
}
