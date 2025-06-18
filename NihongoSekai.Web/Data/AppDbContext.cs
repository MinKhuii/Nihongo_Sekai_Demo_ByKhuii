using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NihongoSekai.Web.Models;

namespace NihongoSekai.Web.Data
{
    public class AppDbContext : IdentityDbContext<Account, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets for all models
        public DbSet<Learner> Learners { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseVideo> CourseVideos { get; set; }
        public DbSet<CourseOutcome> CourseOutcomes { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<WatchedVideo> WatchedVideos { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<TeacherCertification> TeacherCertifications { get; set; }
        public DbSet<PartnerDocument> PartnerDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure composite primary keys
            builder.Entity<Purchase>()
                .HasKey(p => new { p.LearnerId, p.CourseId });

            builder.Entity<WatchedVideo>()
                .HasKey(w => new { w.LearnerId, w.VideoId });

            builder.Entity<Rating>()
                .HasKey(r => new { r.LearnerId, r.CourseId });

            builder.Entity<Enrollment>()
                .HasKey(e => new { e.LearnerId, e.ClassroomId });

            // Configure relationships
            builder.Entity<Learner>()
                .HasOne(l => l.Account)
                .WithOne(a => a.Learner)
                .HasForeignKey<Learner>(l => l.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Teacher>()
                .HasOne(t => t.Account)
                .WithOne(a => a.Teacher)
                .HasForeignKey<Teacher>(t => t.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Admin>()
                .HasOne(a => a.Account)
                .WithOne(acc => acc.Admin)
                .HasForeignKey<Admin>(a => a.AdminId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Course>()
                .HasOne(c => c.Creator)
                .WithMany(a => a.CreatedCourses)
                .HasForeignKey(c => c.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<CourseVideo>()
                .HasOne(cv => cv.Course)
                .WithMany(c => c.Videos)
                .HasForeignKey(cv => cv.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CourseOutcome>()
                .HasOne(co => co.Course)
                .WithMany(c => c.Outcomes)
                .HasForeignKey(co => co.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Purchase>()
                .HasOne(p => p.Learner)
                .WithMany(l => l.Purchases)
                .HasForeignKey(p => p.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Purchase>()
                .HasOne(p => p.Course)
                .WithMany(c => c.Purchases)
                .HasForeignKey(p => p.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<WatchedVideo>()
                .HasOne(w => w.Learner)
                .WithMany(l => l.WatchedVideos)
                .HasForeignKey(w => w.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<WatchedVideo>()
                .HasOne(w => w.Video)
                .WithMany(v => v.WatchedByLearners)
                .HasForeignKey(w => w.VideoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Rating>()
                .HasOne(r => r.Learner)
                .WithMany(l => l.Ratings)
                .HasForeignKey(r => r.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Rating>()
                .HasOne(r => r.Course)
                .WithMany(c => c.Ratings)
                .HasForeignKey(r => r.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Classroom>()
                .HasOne(c => c.Teacher)
                .WithMany(t => t.Classrooms)
                .HasForeignKey(c => c.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Enrollment>()
                .HasOne(e => e.Learner)
                .WithMany(l => l.Enrollments)
                .HasForeignKey(e => e.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Enrollment>()
                .HasOne(e => e.Classroom)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TeacherCertification>()
                .HasOne(tc => tc.Teacher)
                .WithMany(t => t.Certifications)
                .HasForeignKey(tc => tc.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PartnerDocument>()
                .HasOne(pd => pd.Teacher)
                .WithMany(t => t.Documents)
                .HasForeignKey(pd => pd.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure indexes
            builder.Entity<Account>()
                .HasIndex(a => a.Email)
                .IsUnique();

            builder.Entity<Course>()
                .HasIndex(c => c.Title);

            builder.Entity<Course>()
                .HasIndex(c => c.Level);

            builder.Entity<Course>()
                .HasIndex(c => c.Rating);

            builder.Entity<Classroom>()
                .HasIndex(c => c.Title);

            // Seed data
            SeedData(builder);
        }

        private static void SeedData(ModelBuilder builder)
        {
            // Seed roles
            builder.Entity<IdentityRole<int>>().HasData(
                new IdentityRole<int> { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole<int> { Id = 2, Name = "Learner", NormalizedName = "LEARNER" },
                new IdentityRole<int> { Id = 3, Name = "Teacher", NormalizedName = "TEACHER" }
            );

            // Create password hasher
            var hasher = new PasswordHasher<Account>();

            // Seed admin account
            var adminAccount = new Account
            {
                Id = 1,
                Name = "Super Admin",
                UserName = "admin@nihongosekai.com",
                NormalizedUserName = "ADMIN@NIHONGOSEKAI.COM",
                Email = "admin@nihongosekai.com",
                NormalizedEmail = "ADMIN@NIHONGOSEKAI.COM",
                EmailConfirmed = true,
                Role = AccountRole.Admin,
                Status = AccountStatus.Active,
                CreatedAt = new DateTime(2023, 1, 1),
                SecurityStamp = Guid.NewGuid().ToString()
            };
            adminAccount.PasswordHash = hasher.HashPassword(adminAccount, "Admin123!");

            builder.Entity<Account>().HasData(adminAccount);

            // Seed admin profile
            builder.Entity<Admin>().HasData(new Admin
            {
                AdminId = 1,
                Department = "Platform Management"
            });

            // Seed teacher accounts
            var teacher1 = new Account
            {
                Id = 2,
                Name = "Yuki Tanaka",
                UserName = "yuki.tanaka@nihongosekai.com",
                NormalizedUserName = "YUKI.TANAKA@NIHONGOSEKAI.COM",
                Email = "yuki.tanaka@nihongosekai.com",
                NormalizedEmail = "YUKI.TANAKA@NIHONGOSEKAI.COM",
                EmailConfirmed = true,
                Role = AccountRole.Teacher,
                Status = AccountStatus.Active,
                AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
                CreatedAt = new DateTime(2023, 1, 15),
                SecurityStamp = Guid.NewGuid().ToString()
            };
            teacher1.PasswordHash = hasher.HashPassword(teacher1, "Teacher123!");

            var teacher2 = new Account
            {
                Id = 3,
                Name = "Hiroshi Sato",
                UserName = "hiroshi.sato@nihongosekai.com",
                NormalizedUserName = "HIROSHI.SATO@NIHONGOSEKAI.COM",
                Email = "hiroshi.sato@nihongosekai.com",
                NormalizedEmail = "HIROSHI.SATO@NIHONGOSEKAI.COM",
                EmailConfirmed = true,
                Role = AccountRole.Teacher,
                Status = AccountStatus.Active,
                AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroshi Sato",
                CreatedAt = new DateTime(2023, 3, 20),
                SecurityStamp = Guid.NewGuid().ToString()
            };
            teacher2.PasswordHash = hasher.HashPassword(teacher2, "Teacher123!");

            builder.Entity<Account>().HasData(teacher1, teacher2);

            // Seed teacher profiles
            builder.Entity<Teacher>().HasData(
                new Teacher
                {
                    TeacherId = 2,
                    Bio = "Native Japanese speaker with 8 years of teaching experience. I specialize in conversational Japanese and business communication, helping students build confidence in real-world situations.",
                    ShortBio = "Native speaker specializing in conversation and business Japanese. 8+ years experience.",
                    TeachingExperience = 8,
                    AverageRating = 4.9m,
                    IsApproved = true,
                    Specializations = "[\"Conversational Japanese\", \"Business Japanese\", \"Cultural Communication\", \"JLPT N3-N1\"]",
                    Languages = "[\"Japanese (Native)\", \"English (Fluent)\", \"Korean (Intermediate)\"]"
                },
                new Teacher
                {
                    TeacherId = 3,
                    Bio = "Certified JLPT instructor with expertise in grammar and exam preparation. I have been teaching Japanese for 5 years and have helped hundreds of students pass their JLPT exams.",
                    ShortBio = "JLPT specialist with 5+ years experience. 95% student pass rate.",
                    TeachingExperience = 5,
                    AverageRating = 4.8m,
                    IsApproved = true,
                    Specializations = "[\"JLPT Preparation\", \"Grammar\", \"Exam Techniques\", \"Vocabulary Building\"]",
                    Languages = "[\"Japanese (Native)\", \"English (Advanced)\", \"Chinese (Basic)\"]"
                }
            );
        }
    }
}
