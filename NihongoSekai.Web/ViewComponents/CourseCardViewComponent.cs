using Microsoft.AspNetCore.Mvc;
using NihongoSekai.Web.ViewModels;
using NihongoSekai.Web.Models;
using NihongoSekai.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace NihongoSekai.Web.ViewComponents
{
    public class CourseCardViewComponent : ViewComponent
    {
        private readonly AppDbContext _context;

        public CourseCardViewComponent(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(CourseCardViewModel model)
        {
            // If model has minimal data, enhance it from database
            if (model.Id > 0 && string.IsNullOrEmpty(model.Title))
            {
                var course = await _context.Courses
                    .Include(c => c.Creator)
                    .ThenInclude(a => a.Account)
                    .FirstOrDefaultAsync(c => c.CourseId == model.Id);

                if (course != null)
                {
                    model = MapCourseToViewModel(course);
                }
            }

            return View(model);
        }

        public async Task<IViewComponentResult> InvokeAsync(int courseId)
        {
            var course = await _context.Courses
                .Include(c => c.Creator)
                .ThenInclude(a => a.Account)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null)
            {
                return Content(string.Empty);
            }

            var model = MapCourseToViewModel(course);
            return View(model);
        }

        private CourseCardViewModel MapCourseToViewModel(Course course)
        {
            return new CourseCardViewModel
            {
                Id = course.CourseId,
                Title = course.Title,
                Description = course.Description ?? "",
                CoverImageUrl = course.CoverImageUrl ?? "/images/course-placeholder.jpg",
                Price = course.Price,
                Rating = course.Rating,
                Level = course.Level.ToString(),
                StudentsCount = course.StudentsCount,
                Duration = course.Duration,
                InstructorName = course.Creator?.Account?.Name ?? "Nihongo Sekai",
                InstructorAvatar = course.Creator?.Account?.AvatarUrl ?? "/images/default-avatar.png",
                Tags = GetCourseTags(course),
                IsEnrolled = false, // TODO: Check if current user is enrolled
                Progress = 0 // TODO: Get user progress if enrolled
            };
        }

        private List<string> GetCourseTags(Course course)
        {
            var tags = new List<string> { course.Level.ToString() };

            // Add tags based on course content
            if (course.Title.Contains("Business", StringComparison.OrdinalIgnoreCase))
                tags.Add("Business");
            if (course.Title.Contains("Conversation", StringComparison.OrdinalIgnoreCase))
                tags.Add("Speaking");
            if (course.Title.Contains("JLPT", StringComparison.OrdinalIgnoreCase))
                tags.Add("JLPT");
            if (course.Title.Contains("Grammar", StringComparison.OrdinalIgnoreCase))
                tags.Add("Grammar");
            if (course.Title.Contains("Culture", StringComparison.OrdinalIgnoreCase))
                tags.Add("Culture");

            return tags;
        }
    }
}
