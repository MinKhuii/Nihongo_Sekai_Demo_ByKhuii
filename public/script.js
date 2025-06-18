// Nihongo Sekai - Unified JavaScript

// Global Configuration
const CONFIG = {
  // For static HTML deployment, we disable API calls and use mock data
  API_BASE_URL: null, // Set to null to force mock data usage
  TOAST_DURATION: 5000,
  LOADING_MIN_DURATION: 500,
  USE_MOCK_DATA: true, // Force use of mock data for static deployment
};

// Utility Functions
const Utils = {
  // Debounce function
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Format currency
  formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },

  // Format date
  formatDate(date, options = {}) {
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

  // Truncate text
  truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  },

  // Generate random ID
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  // Scroll to element
  scrollTo(element, offset = 0) {
    const targetPosition =
      element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  },
};

// API Functions
async function fetchAPI(endpoint, options = {}) {
  // If API is disabled (static deployment), immediately return failure to trigger mock data
  if (!CONFIG.API_BASE_URL || CONFIG.USE_MOCK_DATA) {
    console.log(`📋 Using mock data for ${endpoint} (static deployment mode)`);
    return { success: false, error: "Static deployment - using mock data" };
  }

  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Expected JSON but got ${contentType || "unknown"} content type`,
      );
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { success: false, error: error.message };
  }
}

// Navigation Functions
function initializeNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target) &&
        navMenu.classList.contains("active")
      ) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });

    // Close mobile menu when clicking on links
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }

  // Highlight current page in navigation
  highlightCurrentNavLink();

  // Add scroll effect to header
  window.addEventListener("scroll", handleHeaderScroll);
}

function highlightCurrentNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const linkPath = new URL(link.href).pathname;

    if (
      (currentPath === "/" || currentPath === "/index.html") &&
      (linkPath === "/" || linkPath === "/index.html")
    ) {
      link.classList.add("active");
    } else if (currentPath.includes(linkPath) && linkPath !== "/") {
      link.classList.add("active");
    }
  });
}

function handleHeaderScroll() {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// Loading Functions
function showLoading() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.classList.add("show");
  }
}

function hideLoading() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    setTimeout(() => {
      loadingIndicator.classList.remove("show");
    }, CONFIG.LOADING_MIN_DURATION);
  }
}

// Toast Notification Functions
function showToast(message, type = "info", duration = CONFIG.TOAST_DURATION) {
  const container = getToastContainer();
  const toast = createToastElement(message, type);

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast);
  }, duration);

  // Add click to dismiss
  toast.addEventListener("click", () => {
    removeToast(toast);
  });
}

function getToastContainer() {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

function createToastElement(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      ${getToastIcon(type)}
      <span class="toast-message">${message}</span>
    </div>
  `;
  return toast;
}

function getToastIcon(type) {
  const icons = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 12l2 2 4-4"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>`,
    error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`,
    warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`,
  };
  return icons[type] || icons.info;
}

function removeToast(toast) {
  toast.style.animation = "slideOut 0.3s ease-in forwards";
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// Card Creation Functions
function createCourseCard(course) {
  return `
    <div class="card course-card" data-course-id="${course.courseId}">
      <img src="${course.coverImageUrl}" alt="${course.name}" class="course-image" loading="lazy">
      <div class="course-content">
        <h3 class="course-title">${course.name}</h3>
        <p class="course-description">${Utils.truncate(course.description, 120)}</p>
        <div class="course-meta">
          <div class="course-rating">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>${course.evaluationPoint}</span>
          </div>
          <div class="course-level">
            <span class="badge badge-primary">${course.level}</span>
          </div>
        </div>
        <div class="course-stats">
          <span>${course.studentsCount.toLocaleString()} students</span>
          <span>${course.duration}h duration</span>
        </div>
        <div class="course-footer">
          <div class="course-price">${Utils.formatCurrency(course.tuition)}</div>
          <a href="course-detail.html?id=${course.courseId}" class="btn btn-primary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  `;
}

function createClassroomCard(classroom) {
  return `
    <div class="card classroom-card" data-classroom-id="${classroom.classroomId}">
      <img src="${classroom.thumbnail}" alt="${classroom.title}" class="classroom-image" loading="lazy">
      <div class="classroom-content">
        <h3 class="classroom-title">${classroom.title}</h3>
        <p class="classroom-description">${Utils.truncate(classroom.description, 100)}</p>
        <div class="classroom-teacher">
          <img src="${classroom.partner.avatarUrl}" alt="${classroom.partner.name}" class="teacher-avatar">
          <div class="teacher-info">
            <div class="teacher-name">${classroom.partner.name}</div>
            <div class="teacher-title">Instructor</div>
          </div>
        </div>
        <div class="classroom-meta">
          <div class="classroom-students">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 21-3-3"/>
            </svg>
            ${classroom.currentStudents}/${classroom.maxStudents} students
          </div>
          <div class="classroom-schedule">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${classroom.schedule}
          </div>
        </div>
        <a href="classroom-detail.html?id=${classroom.classroomId}" class="btn btn-primary">
          Join Classroom
        </a>
      </div>
    </div>
  `;
}

function createTeacherCard(teacher) {
  return `
    <div class="card teacher-card" data-teacher-id="${teacher.partnerId}">
      <div class="teacher-header">
        <img src="${teacher.avatarUrl}" alt="${teacher.account.name}" class="teacher-avatar-large">
        <div class="teacher-info">
          <h3 class="teacher-name">${teacher.account.name}</h3>
          <p class="teacher-specialization">${teacher.specializations.slice(0, 2).join(", ")}</p>
          <div class="teacher-rating">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>${teacher.averageRating}</span>
          </div>
        </div>
      </div>
      <div class="teacher-content">
        <p class="teacher-bio">${Utils.truncate(teacher.shortBio, 120)}</p>
        <div class="teacher-stats">
          <div class="stat">
            <span class="stat-number">${teacher.teachingExperience}</span>
            <span class="stat-label">Years Experience</span>
          </div>
          <div class="stat">
            <span class="stat-number">${teacher.coursesTaught.length}</span>
            <span class="stat-label">Courses</span>
          </div>
        </div>
        <a href="teacher-profile.html?id=${teacher.partnerId}" class="btn btn-outline">
          View Profile
        </a>
      </div>
    </div>
  `;
}

// Form Handling Functions
function handleFormSubmission(form, submitHandler) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Disable submit button
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = "Loading...";

    try {
      await submitHandler(data);
    } catch (error) {
      console.error("Form submission error:", error);
      showToast("An error occurred. Please try again.", "error");
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Search and Filter Functions
function initializeSearch(searchInput, filterFunction) {
  const debouncedFilter = Utils.debounce(filterFunction, 300);

  searchInput.addEventListener("input", (e) => {
    debouncedFilter(e.target.value);
  });
}

function initializeFilters(filterElements, filterFunction) {
  filterElements.forEach((element) => {
    element.addEventListener("change", () => {
      const filters = {};
      filterElements.forEach((el) => {
        if (el.value) {
          filters[el.name] = el.value;
        }
      });
      filterFunction(filters);
    });
  });
}

// Intersection Observer for Animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document
    .querySelectorAll(
      ".section, .hero, .feature-card, .card, .course-card, .classroom-card",
    )
    .forEach((el) => {
      observer.observe(el);
    });
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modalId);
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal(modalId);
      }
    });
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

// URL Parameter Functions
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function setURLParameter(name, value) {
  const url = new URL(window.location);
  url.searchParams.set(name, value);
  window.history.pushState({}, "", url);
}

// Error Handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);

  // Show user-friendly error message
  showToast("Something went wrong. Please refresh the page.", "error");
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
  e.preventDefault();

  // Show user-friendly error message
  showToast("A network error occurred. Please try again.", "error");
});

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeAnimations();

  // Initialize any forms
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    if (form.dataset.autoHandle !== "false") {
      // Add basic form validation
      const inputs = form.querySelectorAll("input[required]");
      inputs.forEach((input) => {
        input.addEventListener("blur", () => {
          validateInput(input);
        });
      });
    }
  });
});

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = "";

  if (input.required && !value) {
    isValid = false;
    errorMessage = "This field is required";
  } else if (input.type === "email" && value && !validateEmail(value)) {
    isValid = false;
    errorMessage = "Please enter a valid email address";
  } else if (input.type === "password" && value && !validatePassword(value)) {
    isValid = false;
    errorMessage = "Password must be at least 6 characters";
  }

  // Update input styling
  if (isValid) {
    input.classList.remove("invalid");
    input.classList.add("valid");
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
  }

  // Show/hide error message
  let errorElement = input.parentNode.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    input.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = errorMessage;
  errorElement.style.display = isValid ? "none" : "block";

  return isValid;
}

// Performance monitoring
window.addEventListener("load", () => {
  setTimeout(() => {
    const perfData = performance.getEntriesByType("navigation")[0];
    if (perfData) {
      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
      console.log(`Page load time: ${Math.round(loadTime)}ms`);

      // Send to analytics if available
      if (typeof gtag !== "undefined") {
        gtag("event", "timing_complete", {
          name: "page_load",
          value: Math.round(loadTime),
        });
      }
    }
  }, 0);
});

// Export functions for use in other scripts
window.NihongoSekai = {
  Utils,
  fetchAPI,
  showLoading,
  hideLoading,
  showToast,
  createCourseCard,
  createClassroomCard,
  createTeacherCard,
  initializeSearch,
  initializeFilters,
  openModal,
  closeModal,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  getURLParameter,
  setURLParameter,
  validateInput,
  handleFormSubmission,
};
