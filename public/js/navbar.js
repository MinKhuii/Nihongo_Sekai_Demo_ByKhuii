// Navbar Component JavaScript

class NavbarComponent {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.navToggle = document.getElementById("navToggle");
    this.navMenu = document.getElementById("navMenu");
    this.navLinks = document.querySelectorAll(".nav-link");

    this.init();
  }

  init() {
    this.setupMobileToggle();
    this.setupScrollEffect();
    this.setupActiveNavigation();
    this.setupSmoothScrolling();
  }

  setupMobileToggle() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener("click", () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !this.navToggle.contains(e.target) &&
          !this.navMenu.contains(e.target)
        ) {
          this.closeMobileMenu();
        }
      });

      // Close menu when clicking on nav links
      this.navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          this.closeMobileMenu();
        });
      });
    }
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle("active");
    this.navToggle.classList.toggle("active");
  }

  closeMobileMenu() {
    this.navMenu.classList.remove("active");
    this.navToggle.classList.remove("active");
  }

  setupScrollEffect() {
    let lastScrollTop = 0;
    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Add/remove background opacity based on scroll
      if (scrollTop > 50) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "none";
      }

      // Hide/show navbar on scroll (optional)
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up
        header.style.transform = "translateY(0)";
      }

      lastScrollTop = scrollTop;
    });
  }

  setupActiveNavigation() {
    const currentPage = window.location.pathname;

    this.navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      // Remove active class from all links first
      link.classList.remove("active");

      // Add active class to current page link
      if (
        href === currentPage ||
        (currentPage === "/" && href === "/") ||
        (currentPage.includes(href) && href !== "/")
      ) {
        link.classList.add("active");
      }
    });
  }

  setupSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
          const headerHeight = document.querySelector(".header").offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Public method to update active navigation
  setActiveLink(href) {
    this.navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === href) {
        link.classList.add("active");
      }
    });
  }

  // Public method to show/hide navbar
  show() {
    document.querySelector(".header").style.transform = "translateY(0)";
  }

  hide() {
    document.querySelector(".header").style.transform = "translateY(-100%)";
  }
}

// Initialize navbar when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.navbar = new NavbarComponent();
});

// Export for Builder.io or other usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = NavbarComponent;
}
