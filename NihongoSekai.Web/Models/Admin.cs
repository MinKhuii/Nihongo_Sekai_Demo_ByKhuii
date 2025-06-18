using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NihongoSekai.Web.Models
{
    public class Admin
    {
        [Key]
        [ForeignKey("Account")]
        public int AdminId { get; set; }

        [StringLength(100)]
        public string Department { get; set; } = "General";

        // Navigation properties
        public Account Account { get; set; } = null!;
        public ICollection<Course> CreatedCourses { get; set; } = new List<Course>();
    }
}
