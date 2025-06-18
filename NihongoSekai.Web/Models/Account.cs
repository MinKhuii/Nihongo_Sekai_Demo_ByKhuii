using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace NihongoSekai.Web.Models
{
    public class Account : IdentityUser<int>
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public AccountRole Role { get; set; }

        public AccountStatus Status { get; set; } = AccountStatus.Pending;

        [StringLength(255)]
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Learner? Learner { get; set; }
        public Teacher? Teacher { get; set; }
        public Admin? Admin { get; set; }
    }

    public enum AccountRole
    {
        Admin,
        Learner,
        Teacher
    }

    public enum AccountStatus
    {
        Active,
        Pending,
        Suspended
    }
}
