using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Web.Models
{
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        public int CreatedBy { get; set; }

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [StringLength(255)]
        public string? CoverImageUrl { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; } = 0;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        [Required]
        public CourseLevel Level { get; set; }

        public int Duration { get; set; } = 0;

        public int StudentsCount { get; set; } = 0;

        public bool IsApproved { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CreatedBy")]
        public Admin Creator { get; set; } = null!;

        public ICollection<CourseVideo> Videos { get; set; } = new List<CourseVideo>();
        public ICollection<CourseOutcome> Outcomes { get; set; } = new List<CourseOutcome>();
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }

    public enum CourseLevel
    {
        Beginner,
        Elementary,
        Intermediate,
        Advanced
    }
}
