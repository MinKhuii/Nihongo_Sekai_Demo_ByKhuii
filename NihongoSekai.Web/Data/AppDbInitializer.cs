using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NihongoSekai.Web.Models;

namespace NihongoSekai.Web.Data
{
    public static class AppDbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Account>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Run any pending migrations
            if ((await context.Database.GetPendingMigrationsAsync()).Any())
            {
                await context.Database.MigrateAsync();
            }

            // Seed additional data if needed
            await SeedSampleDataAsync(context);
        }

        private static async Task SeedSampleDataAsync(AppDbContext context)
        {
            // Check if sample data already exists
            if (await context.Courses.AnyAsync())
                return;

            // Seed sample courses
            var courses = new List<Course>
            {
                new Course
                {
                    CourseId = 1,
                    CreatedBy = 1,
                    Title = "Japanese for Beginners: Hiragana & Katakana",
                    Description = "Master the fundamentals of Japanese writing systems. Learn hiragana and katakana with interactive exercises, pronunciation guides, and cultural context.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=500&h=300&fit=crop",
                    Price = 49.99m,
                    Rating = 4.7m,
                    Level = CourseLevel.Beginner,
                    Duration = 20,
                    StudentsCount = 1247,
                    CreatedAt = new DateTime(2024, 1, 15)
                },
                new Course
                {
                    CourseId = 2,
                    CreatedBy = 1,
                    Title = "Conversational Japanese: Daily Life",
                    Description = "Learn practical Japanese for everyday situations. Practice greetings, shopping, dining, and social interactions with native speakers.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&h=300&fit=crop",
                    Price = 79.99m,
                    Rating = 4.8m,
                    Level = CourseLevel.Elementary,
                    Duration = 35,
                    StudentsCount = 892,
                    CreatedAt = new DateTime(2024, 1, 20)
                },
                new Course
                {
                    CourseId = 3,
                    CreatedBy = 1,
                    Title = "Business Japanese: Professional Communication",
                    Description = "Advanced course for professionals working with Japanese companies. Learn keigo (honorific language), business etiquette, and formal communication.",
                    CoverImageUrl = "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=500&h=300&fit=crop",
                    Price = 129.99m,
                    Rating = 4.9m,
                    Level = CourseLevel.Advanced,
                    Duration = 50,
                    StudentsCount = 456,
                    CreatedAt = new DateTime(2024, 2, 1)
                }
            };

            await context.Courses.AddRangeAsync(courses);

            // Seed course videos
            var videos = new List<CourseVideo>
            {
                new CourseVideo { CourseId = 1, Title = "Introduction to Japanese Writing", VideoUrl = "https://example.com/videos/1-1", Sequence = 1, Duration = 45 },
                new CourseVideo { CourseId = 1, Title = "Hiragana: A-ka-sa-ta-na", VideoUrl = "https://example.com/videos/1-2", Sequence = 2, Duration = 60 },
                new CourseVideo { CourseId = 2, Title = "Greetings and Introductions", VideoUrl = "https://example.com/videos/2-1", Sequence = 1, Duration = 40 },
                new CourseVideo { CourseId = 2, Title = "Shopping and Numbers", VideoUrl = "https://example.com/videos/2-2", Sequence = 2, Duration = 50 }
            };

            await context.CourseVideos.AddRangeAsync(videos);

            // Seed course outcomes
            var outcomes = new List<CourseOutcome>
            {
                new CourseOutcome { CourseId = 1, Description = "Read and write all hiragana characters" },
                new CourseOutcome { CourseId = 1, Description = "Read and write all katakana characters" },
                new CourseOutcome { CourseId = 2, Description = "Engage in basic daily conversations" },
                new CourseOutcome { CourseId = 2, Description = "Navigate shopping and dining situations" }
            };

            await context.CourseOutcomes.AddRangeAsync(outcomes);

            // Seed classrooms
            var classrooms = new List<Classroom>
            {
                new Classroom
                {
                    TeacherId = 2,
                    Title = "Morning Conversation Practice",
                    Description = "Join our morning conversation circle to practice speaking Japanese in a supportive environment. Perfect for beginners to intermediate learners.",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=400&h=300&fit=crop",
                    VideoCallLink = "https://meet.google.com/abc-def-ghi",
                    MaxStudents = 8,
                    CurrentStudents = 5,
                    ScheduleText = "Mon, Wed, Fri 9:00 AM JST",
                    ScheduleJson = "[{\"start\":\"2025-07-10T10:00:00\",\"end\":\"2025-07-10T11:00:00\",\"joinUrl\":\"https://meet.google.com/abc-def-ghi\"}]",
                    CreatedAt = new DateTime(2024, 1, 10)
                },
                new Classroom
                {
                    TeacherId = 3,
                    Title = "JLPT Study Group",
                    Description = "Intensive study sessions focused on JLPT preparation. We cover grammar, vocabulary, and practice tests together.",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
                    VideoCallLink = "https://meet.google.com/jkl-mno-pqr",
                    MaxStudents = 10,
                    CurrentStudents = 7,
                    ScheduleText = "Tue, Thu 7:00 PM JST",
                    ScheduleJson = "[{\"start\":\"2025-07-15T19:00:00\",\"end\":\"2025-07-15T21:00:00\",\"joinUrl\":\"https://meet.google.com/jkl-mno-pqr\"}]",
                    CreatedAt = new DateTime(2024, 1, 15)
                }
            };

            await context.Classrooms.AddRangeAsync(classrooms);

            await context.SaveChangesAsync();
        }
    }
}
