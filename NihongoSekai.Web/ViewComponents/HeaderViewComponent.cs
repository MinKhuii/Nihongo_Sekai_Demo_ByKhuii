using Microsoft.AspNetCore.Mvc;
using NihongoSekai.Web.ViewModels;
using NihongoSekai.Web.Models;
using Microsoft.AspNetCore.Identity;

namespace NihongoSekai.Web.ViewComponents
{
    public class HeaderViewComponent : ViewComponent
    {
        private readonly UserManager<Account> _userManager;

        public HeaderViewComponent(UserManager<Account> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var model = new HeaderViewModel
            {
                LogoText = "Nihongo Sekai",
                LogoSubtext = "Japanese Learning Platform",
                LogoIcon = "日",
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
                NavigationItems = GetNavigationItems()
            };

            if (model.IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(UserClaimsPrincipal);
                if (user != null)
                {
                    model.UserName = user.Name;
                    model.UserAvatar = user.AvatarUrl ?? "/images/default-avatar.png";
                    model.UserRole = user.Role.ToString();
                }
            }

            return View(model);
        }

        private List<NavigationItemViewModel> GetNavigationItems()
        {
            var currentPath = HttpContext.Request.Path.Value?.ToLower() ?? "";

            return new List<NavigationItemViewModel>
            {
                new NavigationItemViewModel
                {
                    Text = "Home",
                    Href = "/",
                    Icon = "bi-house",
                    IsActive = currentPath == "/" || currentPath == ""
                },
                new NavigationItemViewModel
                {
                    Text = "Courses",
                    Href = "/courses",
                    Icon = "bi-book",
                    IsActive = currentPath.StartsWith("/courses")
                },
                new NavigationItemViewModel
                {
                    Text = "Classrooms",
                    Href = "/classrooms",
                    Icon = "bi-people",
                    IsActive = currentPath.StartsWith("/classrooms")
                },
                new NavigationItemViewModel
                {
                    Text = "Teachers",
                    Href = "/teachers",
                    Icon = "bi-person-badge",
                    IsActive = currentPath.StartsWith("/teachers")
                },
                new NavigationItemViewModel
                {
                    Text = "About",
                    Href = "/about",
                    Icon = "bi-info-circle",
                    IsActive = currentPath.StartsWith("/about")
                }
            };
        }
    }
}
