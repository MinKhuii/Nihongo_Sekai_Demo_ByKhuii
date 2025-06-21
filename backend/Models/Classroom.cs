using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Models
{
    [Table("Classrooms")]
    public class Classroom
    {
        [Key]
        public int ClassroomId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "";

        public string? Description { get; set; }

        [Required]
        public int PartnerId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Level { get; set; } = "";

        [Required]
        public int MaxStudents { get; set; } = 20;

        [Required]
        public int CurrentEnrollments { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        [Required]
        public int Duration { get; set; } = 60;

        [MaxLength(500)]
        public string? MeetingUrl { get; set; }

        [MaxLength(100)]
        public string? MeetingId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Scheduled";

        [MaxLength(500)]
        public string? RecordingUrl { get; set; }

        public bool IsRecorded { get; set; } = false;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PartnerId")]
        public virtual Partner Partner { get; set; } = null!;

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;

        public virtual ICollection<ClassroomEnrollment> Enrollments { get; set; } = new List<ClassroomEnrollment>();
    }

    [Table("ClassroomEnrollments")]
    public class ClassroomEnrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        [Required]
        public int ClassroomId { get; set; }

        [Required]
        public int LearnerId { get; set; }

        [Required]
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        [MaxLength(20)]
        public string? AttendanceStatus { get; set; }

        public DateTime? JoinedAt { get; set; }

        public DateTime? LeftAt { get; set; }

        [Range(1, 5)]
        public int? Rating { get; set; }

        public string? Feedback { get; set; }

        // Navigation properties
        [ForeignKey("ClassroomId")]
        public virtual Classroom Classroom { get; set; } = null!;

        [ForeignKey("LearnerId")]
        public virtual Learner Learner { get; set; } = null!;
    }

    [Table("Partners")]
    public class Partner
    {
        [Key]
        public int PartnerId { get; set; }

        [Required]
        public int AccountId { get; set; }

        public string? Bio { get; set; }

        [MaxLength(500)]
        public string? Specializations { get; set; }

        public int? YearsOfExperience { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? HourlyRate { get; set; }

        public string? TeachingCertificates { get; set; }

        public string? AvailabilitySchedule { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal? Rating { get; set; } = 0.00m;

        public int TotalReviews { get; set; } = 0;

        public bool IsApproved { get; set; } = false;

        public DateTime? ApprovedAt { get; set; }

        public int? ApprovedBy { get; set; }

        // Navigation properties
        [ForeignKey("AccountId")]
        public virtual Account Account { get; set; } = null!;

        [ForeignKey("ApprovedBy")]
        public virtual Admin? ApprovedByAdmin { get; set; }

        public virtual ICollection<Classroom> Classrooms { get; set; } = new List<Classroom>();
    }

    [Table("Accounts")]
    public class Account
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = "";

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = "";

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = "";

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = "";

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "";

        public bool IsActive { get; set; } = true;

        public bool EmailVerified { get; set; } = false;

        [MaxLength(500)]
        public string? ProfilePicture { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual Admin? Admin { get; set; }
        public virtual Partner? Partner { get; set; }
        public virtual Learner? Learner { get; set; }
    }

    [Table("Learners")]
    public class Learner
    {
        [Key]
        public int LearnerId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [MaxLength(20)]
        public string? CurrentLevel { get; set; }

        public string? LearningGoals { get; set; }

        [MaxLength(50)]
        public string? PreferredLearningStyle { get; set; }

        public int StudyStreak { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalStudyHours { get; set; } = 0.00m;

        public DateTime? LastActivityAt { get; set; }

        // Navigation properties
        [ForeignKey("AccountId")]
        public virtual Account Account { get; set; } = null!;

        public virtual ICollection<ClassroomEnrollment> ClassroomEnrollments { get; set; } = new List<ClassroomEnrollment>();
        public virtual ICollection<CourseEnrollment> CourseEnrollments { get; set; } = new List<CourseEnrollment>();
    }

    [Table("Admins")]
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public string? Permissions { get; set; }

        // Navigation properties
        [ForeignKey("AccountId")]
        public virtual Account Account { get; set; } = null!;

        public virtual ICollection<Partner> ApprovedPartners { get; set; } = new List<Partner>();
        public virtual ICollection<Course> CreatedCourses { get; set; } = new List<Course>();
        public virtual ICollection<AdminLog> AdminLogs { get; set; } = new List<AdminLog>();
    }

    [Table("Categories")]
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = "";

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? IconUrl { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
        public virtual ICollection<Classroom> Classrooms { get; set; } = new List<Classroom>();
    }

    [Table("Courses")]
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Level { get; set; } = "";

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [MaxLength(50)]
        public string? Duration { get; set; }

        [MaxLength(500)]
        public string? CoverImageUrl { get; set; }

        [MaxLength(500)]
        public string? PreviewVideoUrl { get; set; }

        public bool IsPublished { get; set; } = false;

        [Required]
        public int CreatedBy { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal? Rating { get; set; } = 0.00m;

        public int TotalReviews { get; set; } = 0;

        public int TotalEnrollments { get; set; } = 0;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;

        [ForeignKey("CreatedBy")]
        public virtual Admin CreatedByAdmin { get; set; } = null!;

        public virtual ICollection<CourseLesson> Lessons { get; set; } = new List<CourseLesson>();
        public virtual ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();
    }

    [Table("CourseLessons")]
    public class CourseLesson
    {
        [Key]
        public int LessonId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "";

        public string? Description { get; set; }

        [MaxLength(500)]
        public string? VideoUrl { get; set; }

        public int? Duration { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsPreview { get; set; } = false;

        public string? Materials { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; } = null!;
    }

    [Table("CourseEnrollments")]
    public class CourseEnrollment
    {
        [Key]
        public int EnrollmentId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required]
        public int LearnerId { get; set; }

        [Required]
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(5,2)")]
        public decimal CompletionPercentage { get; set; } = 0.00m;

        public DateTime? LastAccessedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        [MaxLength(500)]
        public string? CertificateUrl { get; set; }

        [Range(1, 5)]
        public int? Rating { get; set; }

        public string? Review { get; set; }

        public DateTime? ReviewedAt { get; set; }

        // Navigation properties
        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; } = null!;

        [ForeignKey("LearnerId")]
        public virtual Learner Learner { get; set; } = null!;
    }

    [Table("AdminLogs")]
    public class AdminLog
    {
        [Key]
        public int LogId { get; set; }

        [Required]
        public int AdminId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Action { get; set; } = "";

        [MaxLength(50)]
        public string? TargetType { get; set; }

        public int? TargetId { get; set; }

        public string? Details { get; set; }

        [MaxLength(45)]
        public string? IpAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("AdminId")]
        public virtual Admin Admin { get; set; } = null!;
    }
}
