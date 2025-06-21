# Video Call API Integration Guide

## Overview

This document describes how to integrate video call functionality into the Nihongo Sekai platform using popular video call APIs like Daily.co, OpenTok, or Twilio Video.

## Architecture

### Frontend Components

- VideoCall React/JavaScript component for rendering video calls
- API calls to create rooms and retrieve access tokens
- Real-time participant management

### Backend (.NET) Implementation

- Room management endpoints
- Token generation and validation
- Session logging and analytics
- Webhook handling for call events

## API Endpoints

### 1. Create Video Room

**Endpoint:** `POST /api/video/create`

**Request Body:**

```json
{
  "classroomId": "string",
  "hostId": "string",
  "sessionName": "string",
  "maxParticipants": 20,
  "scheduledStartTime": "2024-01-01T10:00:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "roomId": "unique-room-id",
    "sessionId": "session-12345",
    "roomUrl": "https://domain.daily.co/room-name",
    "expiresAt": "2024-01-01T12:00:00Z"
  }
}
```

### 2. Generate Access Token

**Endpoint:** `POST /api/video/token`

**Request Body:**

```json
{
  "roomId": "string",
  "userId": "string",
  "role": "host|participant|moderator",
  "userName": "string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt-access-token",
    "roomUrl": "https://domain.daily.co/room-name",
    "expiresAt": "2024-01-01T12:00:00Z",
    "permissions": {
      "canShare": true,
      "canRecord": false,
      "canModerate": true
    }
  }
}
```

### 3. End Session

**Endpoint:** `POST /api/video/end`

**Request Body:**

```json
{
  "sessionId": "string",
  "recordingUrl": "string (optional)"
}
```

## Frontend Implementation

### VideoCall Component (React/JavaScript)

```javascript
class VideoCallComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      roomUrl: options.roomUrl,
      token: options.token,
      userName: options.userName,
      userId: options.userId,
      ...options,
    };
    this.callFrame = null;
    this.isConnected = false;
    this.participants = new Map();
  }

  // Initialize video call
  async init() {
    try {
      // Daily.co implementation
      this.callFrame = window.DailyIframe.createFrame({
        iframeStyle: {
          position: "relative",
          width: "100%",
          height: "400px",
          border: "none",
          borderRadius: "8px",
        },
        showLeaveButton: true,
        showFullscreenButton: true,
        showLocalVideo: true,
        showParticipantsBar: true,
      });

      // Mount to container
      this.callFrame.iframe().style.borderRadius = "8px";
      document
        .getElementById(this.containerId)
        .appendChild(this.callFrame.iframe());

      // Set up event listeners
      this.setupEventListeners();

      // Join the call
      await this.callFrame.join({
        url: this.options.roomUrl,
        token: this.options.token,
        userName: this.options.userName,
      });

      this.isConnected = true;
      console.log("Video call initialized successfully");
    } catch (error) {
      console.error("Failed to initialize video call:", error);
      this.handleError(error);
    }
  }

  setupEventListeners() {
    this.callFrame
      .on("joined-meeting", this.handleJoined.bind(this))
      .on("participant-joined", this.handleParticipantJoined.bind(this))
      .on("participant-left", this.handleParticipantLeft.bind(this))
      .on("left-meeting", this.handleLeft.bind(this))
      .on("error", this.handleError.bind(this))
      .on("camera-error", this.handleCameraError.bind(this))
      .on("recording-started", this.handleRecordingStarted.bind(this))
      .on("recording-stopped", this.handleRecordingStopped.bind(this));
  }

  handleJoined(event) {
    console.log("Joined video call:", event);
    this.updateParticipantCount();

    // Notify UI components
    this.dispatchEvent("videoCallJoined", { event });
  }

  handleParticipantJoined(event) {
    console.log("Participant joined:", event.participant);
    this.participants.set(event.participant.session_id, event.participant);
    this.updateParticipantCount();

    // Notify UI components
    this.dispatchEvent("participantJoined", { participant: event.participant });
  }

  handleParticipantLeft(event) {
    console.log("Participant left:", event.participant);
    this.participants.delete(event.participant.session_id);
    this.updateParticipantCount();

    // Notify UI components
    this.dispatchEvent("participantLeft", { participant: event.participant });
  }

  handleLeft(event) {
    console.log("Left video call:", event);
    this.isConnected = false;
    this.participants.clear();

    // Clean up
    this.dispatchEvent("videoCallLeft", { event });
  }

  handleError(error) {
    console.error("Video call error:", error);
    this.dispatchEvent("videoCallError", { error });
  }

  handleCameraError(error) {
    console.error("Camera error:", error);
    this.dispatchEvent("cameraError", { error });
  }

  updateParticipantCount() {
    const count = this.participants.size + (this.isConnected ? 1 : 0);
    this.dispatchEvent("participantCountChanged", { count });
  }

  // Leave the call
  async leave() {
    if (this.callFrame && this.isConnected) {
      await this.callFrame.leave();
    }
  }

  // Destroy the component
  destroy() {
    if (this.callFrame) {
      this.callFrame.destroy();
      this.callFrame = null;
    }
    this.isConnected = false;
    this.participants.clear();
  }

  // Toggle camera
  setCamera(enabled) {
    if (this.callFrame) {
      this.callFrame.setLocalVideo(enabled);
    }
  }

  // Toggle microphone
  setMicrophone(enabled) {
    if (this.callFrame) {
      this.callFrame.setLocalAudio(enabled);
    }
  }

  // Start recording (if permitted)
  async startRecording() {
    if (this.callFrame) {
      return await this.callFrame.startRecording();
    }
  }

  // Stop recording
  async stopRecording() {
    if (this.callFrame) {
      return await this.callFrame.stopRecording();
    }
  }

  // Custom event dispatcher
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
}

// Usage example
async function initializeVideoCall(classroomId, userId) {
  try {
    // Create room
    const roomResponse = await fetch("/api/video/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        classroomId: classroomId,
        hostId: userId,
        sessionName: `Classroom ${classroomId} Session`,
        maxParticipants: 20,
      }),
    });

    const roomData = await roomResponse.json();

    if (!roomData.success) {
      throw new Error("Failed to create video room");
    }

    // Get access token
    const tokenResponse = await fetch("/api/video/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        roomId: roomData.data.roomId,
        userId: userId,
        role: "participant",
        userName: getCurrentUser().name,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.success) {
      throw new Error("Failed to get access token");
    }

    // Initialize video call component
    const videoCall = new VideoCallComponent("video-container", {
      roomUrl: tokenData.data.roomUrl,
      token: tokenData.data.token,
      userName: getCurrentUser().name,
      userId: userId,
    });

    await videoCall.init();
    return videoCall;
  } catch (error) {
    console.error("Failed to initialize video call:", error);
    showErrorMessage("Unable to start video call. Please try again.");
  }
}
```

## Backend (.NET) Implementation

### VideoController.cs

```csharp
[ApiController]
[Route("api/video")]
public class VideoController : ControllerBase
{
    private readonly IVideoCallService _videoCallService;
    private readonly ILogger<VideoController> _logger;

    public VideoController(IVideoCallService videoCallService, ILogger<VideoController> logger)
    {
        _videoCallService = videoCallService;
        _logger = logger;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> CreateRoom([FromBody] CreateRoomRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();

            // Validate permissions
            if (!await CanHostVideoCall(userId, request.ClassroomId))
            {
                return Forbid("You don't have permission to host this classroom");
            }

            var result = await _videoCallService.CreateRoomAsync(request, userId);

            if (result.Success)
            {
                return Ok(new { success = true, data = result.Data });
            }

            return BadRequest(new { success = false, error = result.Error });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating video room");
            return StatusCode(500, new { success = false, error = "Internal server error" });
        }
    }

    [HttpPost("token")]
    [Authorize]
    public async Task<IActionResult> GetToken([FromBody] GetTokenRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();

            // Validate enrollment/permission
            if (!await CanJoinVideoCall(userId, request.RoomId))
            {
                return Forbid("You don't have permission to join this room");
            }

            var result = await _videoCallService.GenerateTokenAsync(request, userId);

            if (result.Success)
            {
                return Ok(new { success = true, data = result.Data });
            }

            return BadRequest(new { success = false, error = result.Error });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating video token");
            return StatusCode(500, new { success = false, error = "Internal server error" });
        }
    }

    [HttpPost("end")]
    [Authorize]
    public async Task<IActionResult> EndSession([FromBody] EndSessionRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _videoCallService.EndSessionAsync(request, userId);

            if (result.Success)
            {
                return Ok(new { success = true });
            }

            return BadRequest(new { success = false, error = result.Error });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ending video session");
            return StatusCode(500, new { success = false, error = "Internal server error" });
        }
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    private async Task<bool> CanHostVideoCall(string userId, string classroomId)
    {
        // Check if user is teacher of this classroom
        return await _videoCallService.IsTeacherOfClassroomAsync(userId, classroomId);
    }

    private async Task<bool> CanJoinVideoCall(string userId, string roomId)
    {
        // Check if user is enrolled in classroom or is teacher
        return await _videoCallService.CanAccessRoomAsync(userId, roomId);
    }
}
```

### VideoCallService.cs

```csharp
public interface IVideoCallService
{
    Task<ServiceResult<VideoRoomData>> CreateRoomAsync(CreateRoomRequest request, string userId);
    Task<ServiceResult<TokenData>> GenerateTokenAsync(GetTokenRequest request, string userId);
    Task<ServiceResult> EndSessionAsync(EndSessionRequest request, string userId);
    Task<bool> IsTeacherOfClassroomAsync(string userId, string classroomId);
    Task<bool> CanAccessRoomAsync(string userId, string roomId);
}

public class VideoCallService : IVideoCallService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<VideoCallService> _logger;

    public VideoCallService(
        HttpClient httpClient,
        IConfiguration configuration,
        ApplicationDbContext context,
        ILogger<VideoCallService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _context = context;
        _logger = logger;
    }

    public async Task<ServiceResult<VideoRoomData>> CreateRoomAsync(CreateRoomRequest request, string userId)
    {
        try
        {
            // Generate unique room ID
            var roomId = $"nihongo-{request.ClassroomId}-{DateTime.UtcNow.Ticks}";

            // Create room via Daily.co API
            var dailyRequest = new
            {
                name = roomId,
                properties = new
                {
                    max_participants = request.MaxParticipants,
                    enable_chat = true,
                    enable_screenshare = true,
                    enable_recording = "cloud",
                    exp = DateTimeOffset.UtcNow.AddHours(2).ToUnixTimeSeconds()
                }
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.daily.co/v1/rooms", dailyRequest);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Daily.co API error: {Error}", error);
                return ServiceResult<VideoRoomData>.Failure("Failed to create video room");
            }

            var roomData = await response.Content.ReadFromJsonAsync<DailyRoomResponse>();

            // Save session to database
            var session = new VideoCallSession
            {
                ClassroomId = int.Parse(request.ClassroomId),
                RoomId = roomId,
                HostAccountId = int.Parse(userId),
                SessionName = request.SessionName,
                MaxParticipants = request.MaxParticipants,
                StartTime = DateTime.UtcNow
            };

            _context.VideoCallSessions.Add(session);
            await _context.SaveChangesAsync();

            return ServiceResult<VideoRoomData>.Success(new VideoRoomData
            {
                RoomId = roomId,
                SessionId = session.SessionId.ToString(),
                RoomUrl = roomData.Url,
                ExpiresAt = DateTime.UtcNow.AddHours(2)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating video room");
            return ServiceResult<VideoRoomData>.Failure("Internal error creating room");
        }
    }

    public async Task<ServiceResult<TokenData>> GenerateTokenAsync(GetTokenRequest request, string userId)
    {
        try
        {
            // Get session info
            var session = await _context.VideoCallSessions
                .FirstOrDefaultAsync(s => s.RoomId == request.RoomId);

            if (session == null)
            {
                return ServiceResult<TokenData>.Failure("Room not found");
            }

            // Generate token via Daily.co API
            var tokenRequest = new
            {
                properties = new
                {
                    room_name = request.RoomId,
                    user_name = request.UserName,
                    is_owner = request.Role == "host",
                    exp = DateTimeOffset.UtcNow.AddHours(2).ToUnixTimeSeconds()
                }
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.daily.co/v1/meeting-tokens", tokenRequest);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Daily.co token error: {Error}", error);
                return ServiceResult<TokenData>.Failure("Failed to generate access token");
            }

            var tokenData = await response.Content.ReadFromJsonAsync<DailyTokenResponse>();

            return ServiceResult<TokenData>.Success(new TokenData
            {
                Token = tokenData.Token,
                RoomUrl = $"https://nihongosekai.daily.co/{request.RoomId}",
                ExpiresAt = DateTime.UtcNow.AddHours(2),
                Permissions = new TokenPermissions
                {
                    CanShare = true,
                    CanRecord = request.Role == "host",
                    CanModerate = request.Role == "host" || request.Role == "moderator"
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating token");
            return ServiceResult<TokenData>.Failure("Internal error generating token");
        }
    }

    // Additional service methods...
}
```

## Configuration

### appsettings.json

```json
{
  "VideoCall": {
    "Provider": "daily", // "daily", "twilio", "opentok"
    "Daily": {
      "ApiKey": "your-daily-api-key",
      "ApiUrl": "https://api.daily.co/v1",
      "Domain": "nihongosekai.daily.co"
    },
    "Twilio": {
      "AccountSid": "your-twilio-account-sid",
      "ApiKey": "your-twilio-api-key",
      "ApiSecret": "your-twilio-api-secret"
    }
  }
}
```

This integration provides a complete video calling solution with proper authentication, session management, and error handling suitable for the Nihongo Sekai learning platform.
