using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using NihongoSekai.Web.Models;
using NihongoSekai.Web.ViewModels;
using NihongoSekai.Web.Data;
using System.Security.Claims;

namespace NihongoSekai.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<Account> _userManager;
        private readonly SignInManager<Account> _signInManager;
        private readonly AppDbContext _context;
        private readonly ILogger<AccountController> _logger;

        public AccountController(
            UserManager<Account> userManager,
            SignInManager<Account> signInManager,
            AppDbContext context,
            ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = new Account
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                Role = model.Role,
                Status = AccountStatus.Pending
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Create role-specific profile
                await CreateUserProfileAsync(user, model.Role);

                // Add user to role
                await _userManager.AddToRoleAsync(user, model.Role.ToString());

                // Generate email confirmation token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action("ConfirmEmail", "Account",
                    new { userId = user.Id, token }, Request.Scheme);

                _logger.LogInformation($"User {user.Email} registered. Confirmation link: {confirmationLink}");

                TempData["Message"] = "Registration successful! Please check your email to confirm your account.";
                return RedirectToAction("Login");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                _logger.LogInformation($"User {user.Email} logged in.");
                return RedirectToRoleBasedHome(user.Role);
            }

            if (result.RequiresTwoFactor)
            {
                return RedirectToAction("LoginWith2fa");
            }

            if (result.IsLockedOut)
            {
                ModelState.AddModelError(string.Empty, "Account is locked out.");
                return View(model);
            }

            ModelState.AddModelError(string.Empty, "Invalid email or password.");
            return View(model);
        }

        [HttpGet]
        public IActionResult LoginWithGoogle()
        {
            var redirectUrl = Url.Action("GoogleCallback", "Account");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(GoogleDefaults.AuthenticationScheme, redirectUrl);
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet]
        public async Task<IActionResult> GoogleCallback()
        {
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                TempData["Error"] = "Error loading external login information.";
                return RedirectToAction("Login");
            }

            // Try to sign in with external login
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
                return RedirectToRoleBasedHome(user!.Role);
            }

            // If user doesn't exist, create new account
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var name = info.Principal.FindFirstValue(ClaimTypes.Name);

            if (string.IsNullOrEmpty(email))
            {
                TempData["Error"] = "Email not provided by Google.";
                return RedirectToAction("Login");
            }

            var newUser = new Account
            {
                UserName = email,
                Email = email,
                Name = name ?? email,
                Role = AccountRole.Learner,
                Status = AccountStatus.Active,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(newUser);
            if (createResult.Succeeded)
            {
                await _userManager.AddLoginAsync(newUser, info);
                await _userManager.AddToRoleAsync(newUser, AccountRole.Learner.ToString());
                await CreateUserProfileAsync(newUser, AccountRole.Learner);

                await _signInManager.SignInAsync(newUser, isPersistent: false);
                return RedirectToRoleBasedHome(newUser.Role);
            }

            foreach (var error in createResult.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                TempData["Message"] = "If an account with that email exists, a password reset link has been sent.";
                return RedirectToAction("Login");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = Url.Action("ResetPassword", "Account",
                new { userId = user.Id, token }, Request.Scheme);

            _logger.LogInformation($"Password reset requested for {user.Email}. Reset link: {resetLink}");

            TempData["Message"] = "If an account with that email exists, a password reset link has been sent.";
            return RedirectToAction("Login");
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(int userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound();

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                user.Status = AccountStatus.Active;
                await _userManager.UpdateAsync(user);
                TempData["Message"] = "Email confirmed successfully! You can now log in.";
            }
            else
            {
                TempData["Error"] = "Email confirmation failed.";
            }

            return RedirectToAction("Login");
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            return RedirectToAction("Index", "Home");
        }

        private async Task CreateUserProfileAsync(Account user, AccountRole role)
        {
            switch (role)
            {
                case AccountRole.Learner:
                    var learner = new Learner
                    {
                        LearnerId = user.Id,
                        Level = "Beginner",
                        Interests = "General Japanese Learning"
                    };
                    _context.Learners.Add(learner);
                    break;

                case AccountRole.Teacher:
                    var teacher = new Teacher
                    {
                        TeacherId = user.Id,
                        IsApproved = false,
                        TeachingExperience = 0
                    };
                    _context.Teachers.Add(teacher);
                    break;

                case AccountRole.Admin:
                    var admin = new Admin
                    {
                        AdminId = user.Id,
                        Department = "General"
                    };
                    _context.Admins.Add(admin);
                    break;
            }

            await _context.SaveChangesAsync();
        }

        private IActionResult RedirectToRoleBasedHome(AccountRole role)
        {
            return role switch
            {
                AccountRole.Admin => RedirectToAction("Index", "Admin"),
                AccountRole.Teacher => RedirectToAction("Dashboard", "Teacher"),
                AccountRole.Learner => RedirectToAction("Dashboard", "Learner"),
                _ => RedirectToAction("Index", "Home")
            };
        }
    }
}
