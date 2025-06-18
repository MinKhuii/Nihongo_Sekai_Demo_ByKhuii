// Nihongo Sekai - Custom JavaScript

// Initialize site functionality when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initializeTooltips();
  initializeAlerts();
  initializeFormValidation();
  initializeLoadingStates();
  initializeScrollEffects();
  initializeAccessibility();
});

// Initialize Bootstrap tooltips
function initializeTooltips() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Auto-dismiss alerts after 5 seconds
function initializeAlerts() {
  const alerts = document.querySelectorAll(".alert:not(.alert-permanent)");
  alerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = new bootstrap.Alert(alert);
      if (bsAlert) {
        bsAlert.close();
      }
    }, 5000);
  });
}

// Enhanced form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();

        // Focus on first invalid field
        const firstInvalidField = form.querySelector(":invalid");
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }

      form.classList.add("was-validated");
    });

    // Real-time validation for better UX
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(function (input) {
      input.addEventListener("blur", function () {
        input.classList.add("was-validated");
      });

      input.addEventListener("input", function () {
        if (input.classList.contains("was-validated")) {
          input.classList.remove("is-invalid");
          if (input.checkValidity()) {
            input.classList.add("is-valid");
          } else {
            input.classList.add("is-invalid");
          }
        }
      });
    });
  });
}

// Loading states for forms and buttons
function initializeLoadingStates() {
  const forms = document.querySelectorAll("form");

  forms.forEach(function (form) {
    form.addEventListener("submit", function () {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton && form.checkValidity()) {
        showLoading(submitButton);
      }
    });
  });
}

function showLoading(button) {
  button.disabled = true;
  button.classList.add("loading");
  const originalText = button.innerHTML;
  button.setAttribute("data-original-text", originalText);
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Loading...';
}

function hideLoading(button) {
  button.disabled = false;
  button.classList.remove("loading");
  const originalText = button.getAttribute("data-original-text");
  if (originalText) {
    button.innerHTML = originalText;
  }
}

// Scroll effects
function initializeScrollEffects() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Fade in elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

// Accessibility enhancements
function initializeAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className =
    "visually-hidden-focusable position-absolute top-0 start-0 p-2 bg-primary text-white text-decoration-none";
  skipLink.style.zIndex = "9999";
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Enhanced keyboard navigation
  document.addEventListener("keydown", function (e) {
    // ESC key to close modals and dropdowns
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal.show");
      if (openModal) {
        const modal = bootstrap.Modal.getInstance(openModal);
        if (modal) modal.hide();
      }

      const openDropdown = document.querySelector(".dropdown-menu.show");
      if (openDropdown) {
        const dropdown = bootstrap.Dropdown.getInstance(
          openDropdown.previousElementSibling,
        );
        if (dropdown) dropdown.hide();
      }
    }
  });

  // Focus management for modals
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("shown.bs.modal", function () {
      const focusableElement = modal.querySelector(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElement) {
        focusableElement.focus();
      }
    });
  });
}

// Utility functions
const Utils = {
  // Debounce function for search inputs
  debounce: function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  // Format currency
  formatCurrency: function (amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },

  // Format date
  formatDate: function (date, options = {}) {
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(new Date(date));
  },

  // Show toast notification
  showToast: function (message, type = "info") {
    const toastContainer =
      document.querySelector(".toast-container") || createToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

    toastContainer.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, {
      autohide: true,
      delay: 5000,
    });
    bsToast.show();

    toast.addEventListener("hidden.bs.toast", function () {
      toast.remove();
    });
  },

  // API helper for AJAX requests
  api: {
    get: function (url) {
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
    },

    post: function (url, data) {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          RequestVerificationToken: document.querySelector(
            'input[name="__RequestVerificationToken"]',
          )?.value,
        },
        body: JSON.stringify(data),
      }).then((response) => response.json());
    },
  },
};

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "1055";
  document.body.appendChild(container);
  return container;
}

// Japanese specific functionality
const JapaneseUtils = {
  // Convert romaji to hiragana (basic implementation)
  romajiToHiragana: function (romaji) {
    const map = {
      ka: "か",
      ki: "き",
      ku: "く",
      ke: "け",
      ko: "こ",
      sa: "さ",
      shi: "し",
      su: "す",
      se: "せ",
      so: "そ",
      ta: "た",
      chi: "ち",
      tsu: "つ",
      te: "て",
      to: "と",
      na: "な",
      ni: "に",
      nu: "ぬ",
      ne: "ね",
      no: "の",
      ha: "は",
      hi: "ひ",
      fu: "ふ",
      he: "へ",
      ho: "ほ",
      ma: "ま",
      mi: "み",
      mu: "む",
      me: "め",
      mo: "も",
      ya: "や",
      yu: "ゆ",
      yo: "よ",
      ra: "ら",
      ri: "り",
      ru: "る",
      re: "れ",
      ro: "ろ",
      wa: "わ",
      wi: "ゐ",
      we: "ゑ",
      wo: "を",
      n: "ん",
      a: "あ",
      i: "い",
      u: "う",
      e: "え",
      o: "お",
    };

    let result = romaji.toLowerCase();
    for (const [key, value] of Object.entries(map)) {
      result = result.replace(new RegExp(key, "g"), value);
    }
    return result;
  },

  // Add furigana to kanji (placeholder function)
  addFurigana: function (kanji, reading) {
    return `<ruby>${kanji}<rt class="furigana">${reading}</rt></ruby>`;
  },
};

// Export utilities to global scope
window.Utils = Utils;
window.JapaneseUtils = JapaneseUtils;

// Progress tracking for courses
function initializeCourseProgress() {
  const progressBars = document.querySelectorAll(
    ".progress-bar[data-progress]",
  );
  progressBars.forEach((bar) => {
    const progress = parseInt(bar.getAttribute("data-progress"));
    bar.style.width = "0%";

    // Animate progress bar
    setTimeout(() => {
      bar.style.transition = "width 1s ease-in-out";
      bar.style.width = progress + "%";
    }, 100);
  });
}

// Call course progress initialization if on courses page
if (
  window.location.pathname.includes("/courses") ||
  window.location.pathname.includes("/my-courses")
) {
  document.addEventListener("DOMContentLoaded", initializeCourseProgress);
}

// Google Calendar integration helper
window.GoogleCalendar = {
  createEvent: function (eventData) {
    return Utils.api
      .post("/api/calendar/create-event", eventData)
      .then((response) => {
        if (response.success) {
          Utils.showToast("Calendar event created successfully!", "success");
          return response.data;
        } else {
          throw new Error(response.message);
        }
      })
      .catch((error) => {
        Utils.showToast(
          "Failed to create calendar event: " + error.message,
          "danger",
        );
        throw error;
      });
  },
};
