using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Web.Models
{
    public class Teacher
    {
        [Key]
        [ForeignKey("Account")]
        public int TeacherId { get; set; }

        public string? Bio { get; set; }

        [StringLength(255)]
        public string? ShortBio { get; set; }

        public int TeachingExperience { get; set; } = 0;

        [Column(TypeName = "decimal(3,2)")]
        public decimal AverageRating { get; set; } = 0;

        public bool IsApproved { get; set; } = false;

        public string? Specializations { get; set; }

        public string? Languages { get; set; }

        // Navigation properties
        public Account Account { get; set; } = null!;
        public ICollection<TeacherCertification> Certifications { get; set; } = new List<TeacherCertification>();
        public ICollection<PartnerDocument> Documents { get; set; } = new List<PartnerDocument>();
        public ICollection<Classroom> Classrooms { get; set; } = new List<Classroom>();
    }
}
