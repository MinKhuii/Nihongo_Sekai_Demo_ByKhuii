using NihongoSekai.Models;
using NihongoSekai.Models.DTOs;

namespace NihongoSekai.Services
{
    public interface IVideoCallService
    {
        Task<VideoCallResponse> CreateOrGetMeeting(Classroom classroom);
        Task<bool> EndMeeting(string? meetingId);
        Task<bool> ValidateMeetingAccess(string meetingId, int userId);
        Task<MeetingInfo?> GetMeetingInfo(string meetingId);
    }

    public class VideoCallService : IVideoCallService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<VideoCallService> _logger;

        public VideoCallService(
            HttpClient httpClient, 
            IConfiguration configuration,
            ILogger<VideoCallService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<VideoCallResponse> CreateOrGetMeeting(Classroom classroom)
        {
            try
            {
                // If meeting already exists, return existing URL
                if (!string.IsNullOrEmpty(classroom.MeetingUrl) && !string.IsNullOrEmpty(classroom.MeetingId))
                {
                    _logger.LogInformation("Returning existing meeting for classroom {ClassroomId}", classroom.ClassroomId);
                    return new VideoCallResponse
                    {
                        MeetingUrl = classroom.MeetingUrl,
                        MeetingId = classroom.MeetingId,
                        ClassroomTitle = classroom.Title,
                        TeacherName = $"{classroom.Partner.Account.FirstName} {classroom.Partner.Account.LastName}",
                        ScheduledAt = classroom.ScheduledAt,
                        Duration = classroom.Duration
                    };
                }

                // Create new meeting
                var meetingResponse = await CreateNewMeeting(classroom);
                
                _logger.LogInformation("Created new meeting {MeetingId} for classroom {ClassroomId}", 
                    meetingResponse.MeetingId, classroom.ClassroomId);

                return meetingResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating meeting for classroom {ClassroomId}", classroom.ClassroomId);
                throw;
            }
        }

        public async Task<bool> EndMeeting(string? meetingId)
        {
            if (string.IsNullOrEmpty(meetingId))
                return false;

            try
            {
                // Implement actual video service integration here
                // For now, return success for demo purposes
                _logger.LogInformation("Ending meeting {MeetingId}", meetingId);
                
                // Example: Daily.co API call
                // await _httpClient.DeleteAsync($"https://api.daily.co/v1/rooms/{meetingId}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ending meeting {MeetingId}", meetingId);
                return false;
            }
        }

        public async Task<bool> ValidateMeetingAccess(string meetingId, int userId)
        {
            try
            {
                // Implement meeting access validation logic
                // This could check with the video service provider
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating meeting access for {MeetingId}, user {UserId}", meetingId, userId);
                return false;
            }
        }

        public async Task<MeetingInfo?> GetMeetingInfo(string meetingId)
        {
            try
            {
                // Implement meeting info retrieval
                // This would call the video service API to get meeting details
                return new MeetingInfo
                {
                    MeetingId = meetingId,
                    Status = "active",
                    ParticipantCount = 0,
                    StartedAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting meeting info for {MeetingId}", meetingId);
                return null;
            }
        }

        #region Private Methods

        private async Task<VideoCallResponse> CreateNewMeeting(Classroom classroom)
        {
            var videoProvider = _configuration["VideoCall:Provider"] ?? "jitsi";
            
            switch (videoProvider.ToLower())
            {
                case "daily":
                    return await CreateDailyMeeting(classroom);
                case "jitsi":
                    return CreateJitsiMeeting(classroom);
                default:
                    return CreateJitsiMeeting(classroom);
            }
        }

        private async Task<VideoCallResponse> CreateDailyMeeting(Classroom classroom)
        {
            try
            {
                var apiKey = _configuration["VideoCall:Daily:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    _logger.LogWarning("Daily.co API key not configured, falling back to Jitsi");
                    return CreateJitsiMeeting(classroom);
                }

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var roomData = new
                {
                    name = $"classroom-{classroom.ClassroomId}-{Guid.NewGuid():N}",
                    properties = new
                    {
                        start_audio_off = true,
                        start_video_off = false,
                        enable_chat = true,
                        enable_knocking = true,
                        enable_screenshare = true,
                        max_participants = classroom.MaxStudents + 2, // +2 for teacher and potential admin
                        exp = ((DateTimeOffset)classroom.ScheduledAt.AddMinutes(classroom.Duration + 30)).ToUnixTimeSeconds()
                    }
                };

                var response = await _httpClient.PostAsJsonAsync("https://api.daily.co/v1/rooms", roomData);
                
                if (response.IsSuccessStatusCode)
                {
                    var roomResponse = await response.Content.ReadFromJsonAsync<DailyRoomResponse>();
                    
                    return new VideoCallResponse
                    {
                        MeetingUrl = roomResponse?.Url ?? "",
                        MeetingId = roomResponse?.Name ?? "",
                        ClassroomTitle = classroom.Title,
                        TeacherName = $"{classroom.Partner.Account.FirstName} {classroom.Partner.Account.LastName}",
                        ScheduledAt = classroom.ScheduledAt,
                        Duration = classroom.Duration
                    };
                }
                else
                {
                    _logger.LogWarning("Failed to create Daily.co room, falling back to Jitsi");
                    return CreateJitsiMeeting(classroom);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Daily.co meeting, falling back to Jitsi");
                return CreateJitsiMeeting(classroom);
            }
        }

        private VideoCallResponse CreateJitsiMeeting(Classroom classroom)
        {
            // Generate unique room name for Jitsi
            var roomName = $"NihongoSekai-{classroom.ClassroomId}-{DateTime.UtcNow:yyyyMMddHHmm}";
            var jitsiDomain = _configuration["VideoCall:Jitsi:Domain"] ?? "meet.jit.si";
            
            var meetingUrl = $"https://{jitsiDomain}/{roomName}";
            
            return new VideoCallResponse
            {
                MeetingUrl = meetingUrl,
                MeetingId = roomName,
                ClassroomTitle = classroom.Title,
                TeacherName = $"{classroom.Partner.Account.FirstName} {classroom.Partner.Account.LastName}",
                ScheduledAt = classroom.ScheduledAt,
                Duration = classroom.Duration
            };
        }

        #endregion
    }

    #region Helper Classes

    public class DailyRoomResponse
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Url { get; set; }
        public bool Created { get; set; }
    }

    public class MeetingInfo
    {
        public string MeetingId { get; set; } = "";
        public string Status { get; set; } = "";
        public int ParticipantCount { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
    }

    #endregion
}
