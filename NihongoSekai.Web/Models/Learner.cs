using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Web.Models
{
    public class Learner
    {
        [Key]
        [ForeignKey("Account")]
        public int LearnerId { get; set; }

        [StringLength(50)]
        public string Level { get; set; } = "Beginner";

        public string? Interests { get; set; }

        // Navigation properties
        public Account Account { get; set; } = null!;
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<WatchedVideo> WatchedVideos { get; set; } = new List<WatchedVideo>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    }

    public enum LearnerLevel
    {
        Beginner,
        Elementary,
        Intermediate,
        Advanced,
        Native
    }
}
