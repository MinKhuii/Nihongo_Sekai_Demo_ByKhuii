// Footer Component JavaScript

class FooterComponent {
  constructor() {
    this.footer = document.querySelector(".footer");
    this.newsletterForm = document.getElementById("newsletterForm");
    this.languageSelector = document.querySelector(".language-selector");
    this.languageDropdown = document.querySelector(".language-dropdown");
    this.socialLinks = document.querySelectorAll(".social-link");
    this.footerLinks = document.querySelectorAll(".footer-links a");

    this.init();
  }

  init() {
    this.setupNewsletterForm();
    this.setupLanguageSelector();
    this.setupSocialLinkTracking();
    this.setupLinkTracking();
    this.setupIntersectionObserver();
    this.setupAccessibility();
  }

  setupNewsletterForm() {
    if (!this.newsletterForm) return;

    this.newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNewsletterSubmission(e);
    });

    // Real-time email validation
    const emailInput = this.newsletterForm.querySelector(".newsletter-input");
    if (emailInput) {
      emailInput.addEventListener("input", (e) => {
        this.validateEmail(e.target);
      });

      emailInput.addEventListener("blur", (e) => {
        this.validateEmail(e.target);
      });
    }
  }

  validateEmail(input) {
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Remove previous validation classes
    input.classList.remove("valid", "invalid");

    if (email.length > 0) {
      input.classList.add(isValid ? "valid" : "invalid");
    }

    return isValid;
  }

  async handleNewsletterSubmission(e) {
    const formData = new FormData(this.newsletterForm);
    const email =
      formData.get("email") ||
      this.newsletterForm.querySelector(".newsletter-input").value;
    const submitButton =
      this.newsletterForm.querySelector(".newsletter-button");

    if (
      !this.validateEmail(
        this.newsletterForm.querySelector(".newsletter-input"),
      )
    ) {
      this.showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    // Show loading state
    this.setButtonLoading(submitButton, true);

    try {
      // Simulate API call (replace with actual endpoint)
      const response = await this.subscribeToNewsletter(email);

      if (response.success) {
        this.showFormMessage(
          "Thank you for subscribing! Check your email for confirmation.",
          "success",
        );
        this.newsletterForm.reset();
        this.trackNewsletterSignup(email);
      } else {
        throw new Error(response.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      this.showFormMessage("Something went wrong. Please try again.", "error");
    } finally {
      this.setButtonLoading(submitButton, false);
    }
  }

  async subscribeToNewsletter(email) {
    // Simulate API call - replace with actual implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success,
          message: success ? "Subscribed successfully" : "Email already exists",
        });
      }, 1500);
    });
  }

  setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `
        <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Subscribing...
      `;

      // Add loading spinner styles
      if (!document.querySelector("#footer-loading-styles")) {
        const style = document.createElement("style");
        style.id = "footer-loading-styles";
        style.textContent = `
          .loading-spinner {
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      button.disabled = false;
      button.innerHTML = `
        Subscribe
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12,5 19,12 12,19" />
        </svg>
      `;
    }
  }

  showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = this.newsletterForm.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    // Add message styles
    messageDiv.style.cssText = `
      margin-top: 0.5rem;
      font-size: 0.85rem;
      padding: 0.5rem;
      border-radius: 0.25rem;
      ${
        type === "success"
          ? "background: rgba(34, 197, 94, 0.1); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.2);"
          : "background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2);"
      }
    `;

    this.newsletterForm.appendChild(messageDiv);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  setupLanguageSelector() {
    if (!this.languageSelector || !this.languageDropdown) return;

    // Toggle dropdown on click
    this.languageSelector.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleLanguageDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      this.closeLanguageDropdown();
    });

    // Prevent dropdown from closing when clicking inside
    this.languageDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Handle language selection
    const languageOptions =
      this.languageDropdown.querySelectorAll(".language-option");
    languageOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        this.selectLanguage(option.dataset.lang, option.textContent);
      });
    });

    // Keyboard navigation
    this.languageSelector.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleLanguageDropdown();
      } else if (e.key === "Escape") {
        this.closeLanguageDropdown();
      }
    });
  }

  toggleLanguageDropdown() {
    const isOpen = this.languageDropdown.style.opacity === "1";
    if (isOpen) {
      this.closeLanguageDropdown();
    } else {
      this.openLanguageDropdown();
    }
  }

  openLanguageDropdown() {
    this.languageDropdown.style.opacity = "1";
    this.languageDropdown.style.visibility = "visible";
    this.languageDropdown.style.transform = "translateY(0)";
    this.languageSelector.setAttribute("aria-expanded", "true");
  }

  closeLanguageDropdown() {
    this.languageDropdown.style.opacity = "0";
    this.languageDropdown.style.visibility = "hidden";
    this.languageDropdown.style.transform = "translateY(10px)";
    this.languageSelector.setAttribute("aria-expanded", "false");
  }

  selectLanguage(langCode, langName) {
    // Update selector text
    const langText = this.languageSelector.querySelector("span");
    if (langText) {
      langText.textContent = langName;
    }

    // Store preference
    localStorage.setItem("preferredLanguage", langCode);

    // Close dropdown
    this.closeLanguageDropdown();

    // Track language change
    this.trackLanguageChange(langCode);

    // In a real application, you would trigger language change here
    console.log(`Language changed to: ${langCode}`);
  }

  setupSocialLinkTracking() {
    this.socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const platform = this.getSocialPlatform(link.getAttribute("href"));
        this.trackSocialClick(platform);
      });
    });
  }

  getSocialPlatform(href) {
    if (href.includes("facebook")) return "facebook";
    if (href.includes("twitter")) return "twitter";
    if (href.includes("instagram")) return "instagram";
    if (href.includes("youtube")) return "youtube";
    if (href.includes("linkedin")) return "linkedin";
    return "unknown";
  }

  setupLinkTracking() {
    this.footerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const linkText = link.textContent.trim();
        const section = link
          .closest(".footer-section")
          .querySelector(".footer-title").textContent;
        this.trackFooterLinkClick(linkText, section);
      });
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateFooterElements();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    if (this.footer) {
      observer.observe(this.footer);
    }
  }

  animateFooterElements() {
    const footerSections = document.querySelectorAll(".footer-section");
    const socialLinks = document.querySelectorAll(".social-link");

    footerSections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add(
          "fade-in-footer",
          `delay-${Math.min(index + 1, 4)}`,
        );
      }, index * 100);
    });

    // Animate social links
    setTimeout(() => {
      socialLinks.forEach((link, index) => {
        setTimeout(() => {
          link.style.opacity = "0";
          link.style.transform = "translateY(20px)";
          link.style.transition = "all 0.3s ease";

          setTimeout(() => {
            link.style.opacity = "1";
            link.style.transform = "translateY(0)";
          }, 50);
        }, index * 100);
      });
    }, 600);
  }

  setupAccessibility() {
    // Add proper ARIA attributes
    if (this.languageSelector) {
      this.languageSelector.setAttribute("role", "button");
      this.languageSelector.setAttribute("aria-haspopup", "true");
      this.languageSelector.setAttribute("aria-expanded", "false");
      this.languageSelector.setAttribute("tabindex", "0");
    }

    if (this.languageDropdown) {
      this.languageDropdown.setAttribute("role", "menu");
    }

    // Improve social link accessibility
    this.socialLinks.forEach((link) => {
      if (!link.getAttribute("aria-label")) {
        const platform = this.getSocialPlatform(link.getAttribute("href"));
        link.setAttribute(
          "aria-label",
          `Follow us on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
        );
      }
    });
  }

  // Analytics and tracking methods
  trackNewsletterSignup(email) {
    // Google Analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "newsletter_signup", {
        email: email,
        location: "footer",
      });
    }

    console.log("Newsletter signup tracked:", email);
  }

  trackSocialClick(platform) {
    // Google Analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "social_click", {
        platform: platform,
        location: "footer",
      });
    }

    console.log("Social click tracked:", platform);
  }

  trackFooterLinkClick(linkText, section) {
    // Google Analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "footer_link_click", {
        link_text: linkText,
        section: section,
      });
    }

    console.log("Footer link clicked:", { linkText, section });
  }

  trackLanguageChange(langCode) {
    // Google Analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "language_change", {
        language: langCode,
        location: "footer",
      });
    }

    console.log("Language changed:", langCode);
  }

  // Public methods for external control
  openNewsletter() {
    const newsletterInput =
      this.newsletterForm?.querySelector(".newsletter-input");
    if (newsletterInput) {
      newsletterInput.focus();
    }
  }

  setLanguage(langCode) {
    const option = this.languageDropdown?.querySelector(
      `[data-lang="${langCode}"]`,
    );
    if (option) {
      this.selectLanguage(langCode, option.textContent);
    }
  }

  showNewsletterMessage(message, type = "info") {
    this.showFormMessage(message, type);
  }
}

// Initialize footer component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.footer = new FooterComponent();
});

// Export for Builder.io or other usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = FooterComponent;
}
