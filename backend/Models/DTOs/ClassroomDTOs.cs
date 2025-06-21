namespace NihongoSekai.Models.DTOs
{
    public class ClassroomDto
    {
        public int ClassroomId { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public string Level { get; set; } = "";
        public string CategoryName { get; set; } = "";
        public string TeacherName { get; set; } = "";
        public decimal TeacherRating { get; set; }
        public int MaxStudents { get; set; }
        public int CurrentEnrollments { get; set; }
        public decimal Price { get; set; }
        public DateTime ScheduledAt { get; set; }
        public int Duration { get; set; }
        public string Status { get; set; } = "";
        public bool CanJoin { get; set; }
    }

    public class ClassroomDetailDto : ClassroomDto
    {
        public string? TeacherBio { get; set; }
        public int TeacherExperience { get; set; }
        public bool IsEnrolled { get; set; }
        public List<EnrolledStudentDto> EnrolledStudents { get; set; } = new();
    }

    public class EnrolledStudentDto
    {
        public string StudentName { get; set; } = "";
        public DateTime EnrolledAt { get; set; }
        public string? AttendanceStatus { get; set; }
    }

    public class VideoCallResponse
    {
        public string MeetingUrl { get; set; } = "";
        public string? MeetingId { get; set; }
        public string ClassroomTitle { get; set; } = "";
        public string TeacherName { get; set; } = "";
        public DateTime ScheduledAt { get; set; }
        public int Duration { get; set; }
        public string Message { get; set; } = "Video call ready";
    }

    public class StartVideoCallRequest
    {
        public bool EnableRecording { get; set; } = false;
        public bool EnableWaitingRoom { get; set; } = true;
        public int MaxParticipants { get; set; } = 20;
    }

    public class VideoCallStatusDto
    {
        public string Status { get; set; } = "";
        public int ParticipantCount { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public bool IsRecording { get; set; }
        public string? RecordingUrl { get; set; }
    }
}
