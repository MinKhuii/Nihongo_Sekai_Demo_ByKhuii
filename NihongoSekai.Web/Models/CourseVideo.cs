using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Web.Models
{
    public class CourseVideo
    {
        [Key]
        public int VideoId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [StringLength(255)]
        public string? VideoUrl { get; set; }

        [Required]
        public int Sequence { get; set; }

        public int Duration { get; set; } = 0;

        // Navigation properties
        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;

        public ICollection<WatchedVideo> WatchedByLearners { get; set; } = new List<WatchedVideo>();
    }

    public class CourseOutcome
    {
        [Key]
        public int OutcomeId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        // Navigation properties
        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;
    }

    public class Purchase
    {
        [Required]
        public int LearnerId { get; set; }

        [Required]
        public int CourseId { get; set; }

        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;

        public int Progress { get; set; } = 0;

        // Navigation properties
        [ForeignKey("LearnerId")]
        public Learner Learner { get; set; } = null!;

        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;
    }

    public class WatchedVideo
    {
        [Required]
        public int LearnerId { get; set; }

        [Required]
        public int VideoId { get; set; }

        public DateTime WatchedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("LearnerId")]
        public Learner Learner { get; set; } = null!;

        [ForeignKey("VideoId")]
        public CourseVideo Video { get; set; } = null!;
    }

    public class Rating
    {
        [Required]
        public int LearnerId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Range(1, 5)]
        public byte Stars { get; set; }

        public string? Review { get; set; }

        public DateTime RatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("LearnerId")]
        public Learner Learner { get; set; } = null!;

        [ForeignKey("CourseId")]
        public Course Course { get; set; } = null!;
    }
}
