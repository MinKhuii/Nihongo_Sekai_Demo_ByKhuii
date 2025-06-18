using System.ComponentModel.DataAnnotations;

namespace NihongoSekai.Web.ViewModels
{
    // Page-level ViewModels
    public class PageSectionViewModel
    {
        public string Component { get; set; } = string.Empty;
        public Dictionary<string, object> Properties { get; set; } = new();
        public string Id { get; set; } = string.Empty;
        public List<PageSectionViewModel> Children { get; set; } = new();
    }

    public class BuilderPageViewModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Slug { get; set; } = string.Empty;
        public List<PageSectionViewModel> Sections { get; set; } = new();
        public Dictionary<string, object> CustomFields { get; set; } = new();
    }

    // Component-specific ViewModels
    public class HeroSectionViewModel
    {
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string ButtonText { get; set; } = "Get Started";
        public string ButtonLink { get; set; } = "/courses";
        public string? BackgroundImage { get; set; }
        public List<StatItemViewModel> Stats { get; set; } = new();
        public bool ShowStats { get; set; } = true;
    }

    public class StatItemViewModel
    {
        public string Label { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string? Icon { get; set; }
    }

    public class CourseCardViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Rating { get; set; }
        public string Level { get; set; } = string.Empty;
        public int StudentsCount { get; set; }
        public int Duration { get; set; }
        public string InstructorName { get; set; } = string.Empty;
        public string InstructorAvatar { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public bool IsEnrolled { get; set; }
        public int Progress { get; set; }
    }

    public class FeaturedCoursesViewModel
    {
        public string Title { get; set; } = "Featured Courses";
        public string Subtitle { get; set; } = string.Empty;
        public List<CourseCardViewModel> Courses { get; set; } = new();
        public int MaxCourses { get; set; } = 3;
        public string ViewAllLink { get; set; } = "/courses";
        public string ViewAllText { get; set; } = "View All Courses";
    }

    public class ClassroomCardViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public string TeacherAvatar { get; set; } = string.Empty;
        public decimal TeacherRating { get; set; }
        public string Schedule { get; set; } = string.Empty;
        public DateTime? NextSession { get; set; }
        public int CurrentStudents { get; set; }
        public int MaxStudents { get; set; }
        public string Level { get; set; } = string.Empty;
        public bool IsEnrolled { get; set; }
        public string JoinUrl { get; set; } = string.Empty;
    }

    public class TeacherCardViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string ShortBio { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int TeachingExperience { get; set; }
        public int StudentsCount { get; set; }
        public List<string> Specializations { get; set; } = new();
        public List<string> Languages { get; set; } = new();
        public List<CertificationViewModel> Certifications { get; set; } = new();
        public bool IsAvailable { get; set; } = true;
    }

    public class CertificationViewModel
    {
        public string Title { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public string? CredentialId { get; set; }
        public string? VerificationUrl { get; set; }
    }

    public class NavigationItemViewModel
    {
        public string Text { get; set; } = string.Empty;
        public string Href { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<NavigationItemViewModel> SubItems { get; set; } = new();
    }

    public class HeaderViewModel
    {
        public string LogoText { get; set; } = "Nihongo Sekai";
        public string LogoSubtext { get; set; } = "Japanese Learning Platform";
        public string LogoIcon { get; set; } = "日";
        public List<NavigationItemViewModel> NavigationItems { get; set; } = new();
        public bool IsAuthenticated { get; set; }
        public string? UserName { get; set; }
        public string? UserAvatar { get; set; }
        public string? UserRole { get; set; }
    }

    public class FooterViewModel
    {
        public string CompanyName { get; set; } = "Nihongo Sekai";
        public string CompanyDescription { get; set; } = string.Empty;
        public List<FooterSectionViewModel> Sections { get; set; } = new();
        public List<SocialLinkViewModel> SocialLinks { get; set; } = new();
        public string CopyrightText { get; set; } = string.Empty;
    }

    public class FooterSectionViewModel
    {
        public string Title { get; set; } = string.Empty;
        public List<NavigationItemViewModel> Links { get; set; } = new();
    }

    public class SocialLinkViewModel
    {
        public string Platform { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }

    public class StatsGridViewModel
    {
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public List<StatItemViewModel> Stats { get; set; } = new();
        public int Columns { get; set; } = 4;
        public string BackgroundStyle { get; set; } = "light";
    }

    public class TestimonialViewModel
    {
        public string Content { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorTitle { get; set; } = string.Empty;
        public string AuthorAvatar { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public DateTime Date { get; set; }
    }

    public class TestimonialsViewModel
    {
        public string Title { get; set; } = "What Our Students Say";
        public string Subtitle { get; set; } = string.Empty;
        public List<TestimonialViewModel> Testimonials { get; set; } = new();
        public bool ShowRatings { get; set; } = true;
    }

    public class CallToActionViewModel
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PrimaryButtonText { get; set; } = string.Empty;
        public string PrimaryButtonLink { get; set; } = string.Empty;
        public string? SecondaryButtonText { get; set; }
        public string? SecondaryButtonLink { get; set; }
        public string BackgroundImage { get; set; } = string.Empty;
        public string BackgroundStyle { get; set; } = "gradient";
    }

    public class SearchFilterViewModel
    {
        public string Query { get; set; } = string.Empty;
        public List<string> Levels { get; set; } = new();
        public List<string> Categories { get; set; } = new();
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string SortBy { get; set; } = "popularity";
        public string SortOrder { get; set; } = "desc";
    }

    public class PaginationViewModel
    {
        public int CurrentPage { get; set; } = 1;
        public int TotalPages { get; set; }
        public int PageSize { get; set; } = 12;
        public int TotalItems { get; set; }
        public string BaseUrl { get; set; } = string.Empty;
        public bool ShowPageNumbers { get; set; } = true;
        public int MaxPageNumbers { get; set; } = 5;
    }

    // Form ViewModels
    public class ContactFormViewModel
    {
        [Required]
        [Display(Name = "Full Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Subject")]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Message")]
        [MinLength(10)]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "I'm interested in")]
        public string? InterestedIn { get; set; }
    }

    public class NewsletterSignupViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "First Name")]
        public string? FirstName { get; set; }

        [Display(Name = "Learning Level")]
        public string? Level { get; set; }

        [Display(Name = "I agree to receive updates")]
        public bool AgreeToEmails { get; set; }
    }

    // Error and Status ViewModels
    public class ErrorPageViewModel
    {
        public int StatusCode { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? ReturnUrl { get; set; }
        public bool ShowContactSupport { get; set; } = true;
    }

    public class LoadingStateViewModel
    {
        public string Message { get; set; } = "Loading...";
        public string Size { get; set; } = "medium";
        public bool ShowSpinner { get; set; } = true;
    }

    public class AlertViewModel
    {
        public string Type { get; set; } = "info"; // success, warning, error, info
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool Dismissible { get; set; } = true;
        public string? ActionText { get; set; }
        public string? ActionUrl { get; set; }
    }
}
