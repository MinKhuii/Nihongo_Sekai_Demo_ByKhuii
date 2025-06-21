using Microsoft.EntityFrameworkCore;
using NihongoSekai.Models;

namespace NihongoSekai.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<Learner> Learners { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseLesson> CourseLessons { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<CourseEnrollment> CourseEnrollments { get; set; }
        public DbSet<ClassroomEnrollment> ClassroomEnrollments { get; set; }
        public DbSet<AdminLog> AdminLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Account entity
            modelBuilder.Entity<Account>(entity =>
            {
                entity.HasKey(e => e.AccountId);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Role);
                entity.HasIndex(e => e.IsActive);

                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                // Configure check constraint for Role
                entity.HasCheckConstraint("CK_Accounts_Role", 
                    "[Role] IN ('Admin', 'Partner', 'Learner')");
            });

            // Configure Admin entity
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.AdminId);
                entity.HasOne(e => e.Account)
                      .WithOne(a => a.Admin)
                      .HasForeignKey<Admin>(e => e.AccountId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Partner entity
            modelBuilder.Entity<Partner>(entity =>
            {
                entity.HasKey(e => e.PartnerId);
                entity.HasOne(e => e.Account)
                      .WithOne(a => a.Partner)
                      .HasForeignKey<Partner>(e => e.AccountId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.ApprovedByAdmin)
                      .WithMany(a => a.ApprovedPartners)
                      .HasForeignKey(e => e.ApprovedBy)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.Property(e => e.HourlyRate).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Rating).HasColumnType("decimal(3,2)");
            });

            // Configure Learner entity
            modelBuilder.Entity<Learner>(entity =>
            {
                entity.HasKey(e => e.LearnerId);
                entity.HasOne(e => e.Account)
                      .WithOne(a => a.Learner)
                      .HasForeignKey<Learner>(e => e.AccountId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.TotalStudyHours).HasColumnType("decimal(10,2)");

                // Configure check constraint for CurrentLevel
                entity.HasCheckConstraint("CK_Learners_CurrentLevel", 
                    "[CurrentLevel] IS NULL OR [CurrentLevel] IN ('Beginner', 'Elementary', 'Intermediate', 'Advanced')");
            });

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.CategoryId);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            // Configure Course entity
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(e => e.CourseId);
                entity.HasIndex(e => e.CategoryId);
                entity.HasIndex(e => e.Level);
                entity.HasIndex(e => e.IsPublished);
                entity.HasIndex(e => e.CreatedAt);

                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Courses)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByAdmin)
                      .WithMany(a => a.CreatedCourses)
                      .HasForeignKey(e => e.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Rating).HasColumnType("decimal(3,2)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                // Configure check constraint for Level
                entity.HasCheckConstraint("CK_Courses_Level", 
                    "[Level] IN ('Beginner', 'Elementary', 'Intermediate', 'Advanced')");
            });

            // Configure CourseLesson entity
            modelBuilder.Entity<CourseLesson>(entity =>
            {
                entity.HasKey(e => e.LessonId);
                entity.HasOne(e => e.Course)
                      .WithMany(c => c.Lessons)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure Classroom entity
            modelBuilder.Entity<Classroom>(entity =>
            {
                entity.HasKey(e => e.ClassroomId);
                entity.HasIndex(e => e.PartnerId);
                entity.HasIndex(e => e.ScheduledAt);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Level);

                entity.HasOne(e => e.Partner)
                      .WithMany(p => p.Classrooms)
                      .HasForeignKey(e => e.PartnerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Classrooms)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");

                // Configure check constraints
                entity.HasCheckConstraint("CK_Classrooms_Level", 
                    "[Level] IN ('Beginner', 'Elementary', 'Intermediate', 'Advanced')");
                entity.HasCheckConstraint("CK_Classrooms_Status", 
                    "[Status] IN ('Scheduled', 'Live', 'Completed', 'Cancelled')");
            });

            // Configure CourseEnrollment entity
            modelBuilder.Entity<CourseEnrollment>(entity =>
            {
                entity.HasKey(e => e.EnrollmentId);
                entity.HasIndex(e => e.CourseId);
                entity.HasIndex(e => e.LearnerId);
                entity.HasIndex(e => new { e.CourseId, e.LearnerId }).IsUnique();

                entity.HasOne(e => e.Course)
                      .WithMany(c => c.Enrollments)
                      .HasForeignKey(e => e.CourseId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Learner)
                      .WithMany(l => l.CourseEnrollments)
                      .HasForeignKey(e => e.LearnerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.CompletionPercentage).HasColumnType("decimal(5,2)");
                entity.Property(e => e.EnrolledAt).HasDefaultValueSql("GETDATE()");

                // Configure check constraint for Rating
                entity.HasCheckConstraint("CK_CourseEnrollments_Rating", 
                    "[Rating] IS NULL OR ([Rating] >= 1 AND [Rating] <= 5)");
            });

            // Configure ClassroomEnrollment entity
            modelBuilder.Entity<ClassroomEnrollment>(entity =>
            {
                entity.HasKey(e => e.EnrollmentId);
                entity.HasIndex(e => e.ClassroomId);
                entity.HasIndex(e => e.LearnerId);
                entity.HasIndex(e => new { e.ClassroomId, e.LearnerId }).IsUnique();

                entity.HasOne(e => e.Classroom)
                      .WithMany(c => c.Enrollments)
                      .HasForeignKey(e => e.ClassroomId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Learner)
                      .WithMany(l => l.ClassroomEnrollments)
                      .HasForeignKey(e => e.LearnerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.EnrolledAt).HasDefaultValueSql("GETDATE()");

                // Configure check constraints
                entity.HasCheckConstraint("CK_ClassroomEnrollments_AttendanceStatus", 
                    "[AttendanceStatus] IS NULL OR [AttendanceStatus] IN ('Registered', 'Attended', 'Absent', 'Cancelled')");
                entity.HasCheckConstraint("CK_ClassroomEnrollments_Rating", 
                    "[Rating] IS NULL OR ([Rating] >= 1 AND [Rating] <= 5)");
            });

            // Configure AdminLog entity
            modelBuilder.Entity<AdminLog>(entity =>
            {
                entity.HasKey(e => e.LogId);
                entity.HasIndex(e => e.AdminId);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.Action);

                entity.HasOne(e => e.Admin)
                      .WithMany(a => a.AdminLogs)
                      .HasForeignKey(e => e.AdminId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Configure database-level constraints and triggers
            ConfigureDatabaseConstraints(modelBuilder);
        }

        private void ConfigureDatabaseConstraints(ModelBuilder modelBuilder)
        {
            // Additional database-level configurations can be added here
            
            // Example: Configure default values that require SQL Server functions
            modelBuilder.Entity<Account>()
                .Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Account>()
                .Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Add any custom SQL constraints or stored procedures here if needed
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                if (entry.Entity is Account account)
                {
                    if (entry.State == EntityState.Added)
                    {
                        account.CreatedAt = DateTime.UtcNow;
                    }
                    account.UpdatedAt = DateTime.UtcNow;
                }

                if (entry.Entity is Course course)
                {
                    if (entry.State == EntityState.Added)
                    {
                        course.CreatedAt = DateTime.UtcNow;
                    }
                    course.UpdatedAt = DateTime.UtcNow;
                }

                if (entry.Entity is Classroom classroom)
                {
                    if (entry.State == EntityState.Added)
                    {
                        classroom.CreatedAt = DateTime.UtcNow;
                    }
                    classroom.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
