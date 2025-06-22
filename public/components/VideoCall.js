/**
 * VideoCall Component for Nihongo Sekai Platform
 * Provides reusable video calling functionality for classrooms
 */

class VideoCallComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      roomUrl: options.roomUrl,
      token: options.token,
      userName: options.userName,
      userId: options.userId,
      isHost: options.isHost || false,
      onParticipantJoined: options.onParticipantJoined || (() => {}),
      onParticipantLeft: options.onParticipantLeft || (() => {}),
      onCallEnded: options.onCallEnded || (() => {}),
      onError: options.onError || (() => {}),
      ...options,
    };

    this.callFrame = null;
    this.isConnected = false;
    this.participants = new Map();
    this.isRecording = false;
    this.startTime = null;

    // Bind methods
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.leave = this.leave.bind(this);
  }

  /**
   * Initialize the video call component
   */
  async init() {
    try {
      const container = document.getElementById(this.containerId);
      if (!container) {
        throw new Error(`Container with ID '${this.containerId}' not found`);
      }

      // Check if Daily.co is available
      if (typeof window.DailyIframe === "undefined") {
        throw new Error(
          "Daily.co library not loaded. Please include the Daily.co script.",
        );
      }

      // Create Daily iframe
      this.callFrame = window.DailyIframe.createFrame({
        iframeStyle: {
          position: "relative",
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#1a1a1a",
        },
        showLeaveButton: true,
        showFullscreenButton: true,
        showLocalVideo: true,
        showParticipantsBar: true,
        theme: {
          accent: "#dc2626",
          accentText: "#ffffff",
          background: "#ffffff",
          backgroundAccent: "#f8fafc",
          baseText: "#1e293b",
          border: "#e2e8f0",
          mainAreaBg: "#1a1a1a",
          mainAreaBgAccent: "#374151",
          mainAreaText: "#ffffff",
          supportiveText: "#64748b",
        },
      });

      // Clear container and append iframe
      container.innerHTML = "";
      container.appendChild(this.callFrame.iframe());

      // Set up event listeners
      this.setupEventListeners();

      // Join the call
      await this.callFrame.join({
        url: this.options.roomUrl,
        token: this.options.token,
        userName: this.options.userName,
      });

      this.isConnected = true;
      this.startTime = new Date();

      console.log("Video call initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize video call:", error);
      this.handleError(error);
      return false;
    }
  }

  /**
   * Set up event listeners for the video call
   */
  setupEventListeners() {
    this.callFrame
      .on("joined-meeting", this.handleJoined.bind(this))
      .on("participant-joined", this.handleParticipantJoined.bind(this))
      .on("participant-left", this.handleParticipantLeft.bind(this))
      .on("left-meeting", this.handleLeft.bind(this))
      .on("error", this.handleError.bind(this))
      .on("camera-error", this.handleCameraError.bind(this))
      .on("recording-started", this.handleRecordingStarted.bind(this))
      .on("recording-stopped", this.handleRecordingStopped.bind(this))
      .on("participant-updated", this.handleParticipantUpdated.bind(this));
  }

  /**
   * Handle user joining the call
   */
  handleJoined(event) {
    console.log("Joined video call:", event);
    this.updateParticipantCount();

    // Show connection success message
    this.showToast("Connected to video call", "success");

    // Dispatch custom event
    this.dispatchEvent("videoCallJoined", { event, startTime: this.startTime });
  }

  /**
   * Handle participant joining
   */
  handleParticipantJoined(event) {
    const participant = event.participant;
    console.log("Participant joined:", participant);

    this.participants.set(participant.session_id, participant);
    this.updateParticipantCount();

    // Show notification
    this.showToast(
      `${participant.user_name || "Someone"} joined the call`,
      "info",
    );

    // Call callback
    this.options.onParticipantJoined(participant);

    // Dispatch custom event
    this.dispatchEvent("participantJoined", { participant });
  }

  /**
   * Handle participant leaving
   */
  handleParticipantLeft(event) {
    const participant = event.participant;
    console.log("Participant left:", participant);

    this.participants.delete(participant.session_id);
    this.updateParticipantCount();

    // Show notification
    this.showToast(
      `${participant.user_name || "Someone"} left the call`,
      "info",
    );

    // Call callback
    this.options.onParticipantLeft(participant);

    // Dispatch custom event
    this.dispatchEvent("participantLeft", { participant });
  }

  /**
   * Handle leaving the call
   */
  handleLeft(event) {
    console.log("Left video call:", event);
    this.isConnected = false;
    this.participants.clear();

    const duration = this.startTime ? new Date() - this.startTime : 0;

    // Call callback
    this.options.onCallEnded({ duration, event });

    // Dispatch custom event
    this.dispatchEvent("videoCallLeft", { event, duration });
  }

  /**
   * Handle errors
   */
  handleError(error) {
    console.error("Video call error:", error);

    let message = "Video call error occurred";
    if (error.type === "permissions-error") {
      message = "Camera/microphone permissions denied";
    } else if (error.type === "connection-error") {
      message = "Connection failed. Please check your internet.";
    }

    this.showToast(message, "error");

    // Call callback
    this.options.onError(error);

    // Dispatch custom event
    this.dispatchEvent("videoCallError", { error });
  }

  /**
   * Handle camera errors
   */
  handleCameraError(error) {
    console.error("Camera error:", error);
    this.showToast("Camera access error. Please check permissions.", "warning");
    this.dispatchEvent("cameraError", { error });
  }

  /**
   * Handle recording started
   */
  handleRecordingStarted(event) {
    this.isRecording = true;
    this.showToast("Recording started", "info");
    this.dispatchEvent("recordingStarted", { event });
  }

  /**
   * Handle recording stopped
   */
  handleRecordingStopped(event) {
    this.isRecording = false;
    this.showToast("Recording stopped", "info");
    this.dispatchEvent("recordingStopped", { event });
  }

  /**
   * Handle participant updates
   */
  handleParticipantUpdated(event) {
    const participant = event.participant;
    this.participants.set(participant.session_id, participant);
    this.dispatchEvent("participantUpdated", { participant });
  }

  /**
   * Update participant count display
   */
  updateParticipantCount() {
    const count = this.participants.size + (this.isConnected ? 1 : 0);
    this.dispatchEvent("participantCountChanged", { count });

    // Update UI elements if they exist
    const countElements = document.querySelectorAll(".participant-count");
    countElements.forEach((el) => {
      el.textContent = count;
    });
  }

  /**
   * Leave the call
   */
  async leave() {
    if (this.callFrame && this.isConnected) {
      try {
        await this.callFrame.leave();
      } catch (error) {
        console.error("Error leaving call:", error);
      }
    }
  }

  /**
   * Destroy the component
   */
  destroy() {
    if (this.callFrame) {
      this.callFrame.destroy();
      this.callFrame = null;
    }
    this.isConnected = false;
    this.participants.clear();

    // Clear container
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = "";
    }
  }

  /**
   * Toggle camera on/off
   */
  setCamera(enabled) {
    if (this.callFrame) {
      this.callFrame.setLocalVideo(enabled);
      this.dispatchEvent("cameraToggled", { enabled });
    }
  }

  /**
   * Toggle microphone on/off
   */
  setMicrophone(enabled) {
    if (this.callFrame) {
      this.callFrame.setLocalAudio(enabled);
      this.dispatchEvent("microphoneToggled", { enabled });
    }
  }

  /**
   * Start recording (host only)
   */
  async startRecording() {
    if (!this.options.isHost) {
      throw new Error("Only hosts can start recording");
    }

    if (this.callFrame) {
      try {
        const result = await this.callFrame.startRecording();
        return result;
      } catch (error) {
        console.error("Error starting recording:", error);
        throw error;
      }
    }
  }

  /**
   * Stop recording (host only)
   */
  async stopRecording() {
    if (!this.options.isHost) {
      throw new Error("Only hosts can stop recording");
    }

    if (this.callFrame) {
      try {
        const result = await this.callFrame.stopRecording();
        return result;
      } catch (error) {
        console.error("Error stopping recording:", error);
        throw error;
      }
    }
  }

  /**
   * Get current participants
   */
  getParticipants() {
    return Array.from(this.participants.values());
  }

  /**
   * Get call statistics
   */
  getStats() {
    const duration = this.startTime ? new Date() - this.startTime : 0;
    return {
      isConnected: this.isConnected,
      participantCount: this.participants.size + (this.isConnected ? 1 : 0),
      duration: duration,
      isRecording: this.isRecording,
      startTime: this.startTime,
    };
  }

  /**
   * Show toast notification
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `video-call-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#3b82f6"};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInFromRight 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  /**
   * Dispatch custom events
   */
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`videoCall:${eventName}`, {
      detail: { ...data, component: this },
    });
    document.dispatchEvent(event);
  }
}

/**
 * Factory function to create and initialize video call
 */
async function createVideoCall(classroomId, userId, options = {}) {
  try {
    // Get room and token from API
    const { roomUrl, token } = await getVideoCallCredentials(
      classroomId,
      userId,
    );

    const videoCall = new VideoCallComponent("video-call-container", {
      roomUrl,
      token,
      userName: getCurrentUser()?.name || "Student",
      userId,
      ...options,
    });

    const success = await videoCall.init();

    if (success) {
      return videoCall;
    } else {
      throw new Error("Failed to initialize video call");
    }
  } catch (error) {
    console.error("Failed to create video call:", error);
    throw error;
  }
}

/**
 * Get video call credentials from API
 */
async function getVideoCallCredentials(classroomId, userId) {
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
      throw new Error(roomData.error || "Failed to create video room");
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
        userName: getCurrentUser()?.name || "Student",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.success) {
      throw new Error(tokenData.error || "Failed to get access token");
    }

    return {
      roomUrl: tokenData.data.roomUrl,
      token: tokenData.data.token,
    };
  } catch (error) {
    console.error("Failed to get video call credentials:", error);
    throw error;
  }
}

/**
 * Helper function to get current user data
 */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user_data"));
  } catch {
    return null;
  }
}

/**
 * Helper function to get auth token
 */
function getAuthToken() {
  return localStorage.getItem("auth_token") || "";
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VideoCallComponent, createVideoCall };
} else {
  window.VideoCallComponent = VideoCallComponent;
  window.createVideoCall = createVideoCall;
}
