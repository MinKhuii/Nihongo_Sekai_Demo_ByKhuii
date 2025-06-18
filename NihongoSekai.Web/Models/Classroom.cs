using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Web.Models
{
    public class Classroom
    {
        [Key]
        public int ClassroomId { get; set; }

        [Required]
        public int TeacherId { get; set; }

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [StringLength(255)]
        public string? ThumbnailUrl { get; set; }

        [StringLength(255)]
        public string? VideoCallLink { get; set; }

        public int MaxStudents { get; set; } = 10;

        public int CurrentStudents { get; set; } = 0;

        [StringLength(255)]
        public string? ScheduleText { get; set; }

        public string? ScheduleJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("TeacherId")]
        public Teacher Teacher { get; set; } = null!;

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }

    public class Enrollment
    {
        [Required]
        public int LearnerId { get; set; }

        [Required]
        public int ClassroomId { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("LearnerId")]
        public Learner Learner { get; set; } = null!;

        [ForeignKey("ClassroomId")]
        public Classroom Classroom { get; set; } = null!;
    }

    public class TeacherCertification
    {
        [Key]
        public int CertificationId { get; set; }

        [Required]
        public int TeacherId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Issuer { get; set; } = string.Empty;

        [Required]
        public DateTime IssueDate { get; set; }

        [StringLength(100)]
        public string? CredentialId { get; set; }

        [StringLength(255)]
        public string? VerificationUrl { get; set; }

        // Navigation properties
        [ForeignKey("TeacherId")]
        public Teacher Teacher { get; set; } = null!;
    }

    public class PartnerDocument
    {
        [Key]
        public int DocumentId { get; set; }

        [Required]
        public int TeacherId { get; set; }

        [Required]
        public DocumentType DocumentType { get; set; }

        [Required]
        [StringLength(255)]
        public string FilePath { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("TeacherId")]
        public Teacher Teacher { get; set; } = null!;
    }

    public enum DocumentType
    {
        Certificate,
        Resume,
        Photo,
        Other
    }
}
