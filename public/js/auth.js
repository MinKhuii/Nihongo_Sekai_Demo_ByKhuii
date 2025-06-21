/**
 * Authentication JavaScript
 * Handles role-aware sign-in/sign-up with real-time validation
 */

class AuthSystem {
  constructor() {
    this.currentRole = "learner";
    this.currentPage = this.getPageType();
    this.isLoading = false;
    this.validationRules = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
      },
    };

    this.init();
  }

  init() {
    this.setupRoleTabs();
    this.setupFormValidation();
    this.setupSocialButtons();
    this.setupDemoCards();
    this.setupFileUploads();
    this.setupFormSubmission();
    this.renderRoleSpecificFields();
  }

  getPageType() {
    const path = window.location.pathname;
    if (path.includes("login") || path.includes("sign-in")) return "signin";
    if (path.includes("register") || path.includes("sign-up")) return "signup";
    return "signin";
  }

  setupRoleTabs() {
    const roleTabs = document.querySelectorAll(".role-tab");
    const tabsContainer = document.querySelector(".role-tabs");

    if (!roleTabs.length) return;

    roleTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        this.switchRole(tab.dataset.role, index);
      });
    });

    // Set initial active tab
    this.switchRole("learner", 0);
  }

  switchRole(role, index) {
    this.currentRole = role;

    // Update active tab styling
    document.querySelectorAll(".role-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.querySelector(`[data-role="${role}"]`).classList.add("active");

    // Update tab indicator
    const tabsContainer = document.querySelector(".role-tabs");
    if (tabsContainer) {
      tabsContainer.setAttribute("data-active", index);
    }

    // Render role-specific fields
    this.renderRoleSpecificFields();

    // Update form labels and buttons
    this.updateFormLabels();
  }

  renderRoleSpecificFields() {
    const dynamicFields = document.getElementById("dynamicFields");
    if (!dynamicFields) return;

    let fieldsHTML = "";

    if (this.currentRole === "partner") {
      fieldsHTML = `
        <div class="form-group">
          <label class="form-label" for="experience">Years of Experience *</label>
          <select id="experience" name="experience" class="form-input" required>
            <option value="">Select experience</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Specializations</label>
          <div class="specializations-grid">
            <label class="checkbox-group">
              <input type="checkbox" name="specializations" value="conversation" class="checkbox-input">
              <span class="checkbox-label">Conversation Practice</span>
            </label>
            <label class="checkbox-group">
              <input type="checkbox" name="specializations" value="business" class="checkbox-input">
              <span class="checkbox-label">Business Japanese</span>
            </label>
            <label class="checkbox-group">
              <input type="checkbox" name="specializations" value="jlpt" class="checkbox-input">
              <span class="checkbox-label">JLPT Preparation</span>
            </label>
            <label class="checkbox-group">
              <input type="checkbox" name="specializations" value="grammar" class="checkbox-input">
              <span class="checkbox-label">Grammar</span>
            </label>
            <label class="checkbox-group">
              <input type="checkbox" name="specializations" value="culture" class="checkbox-input">
              <span class="checkbox-label">Cultural Studies</span>
            </label>
            <label class="checkbox-group">
              <input type="checkbox" name="specializations" value="pronunciation" class="checkbox-input">
              <span class="checkbox-label">Pronunciation</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="certificates">Certificates & Qualifications</label>
          <div class="file-upload" id="certificateUpload">
            <div class="file-upload-icon">📁</div>
            <div class="file-upload-text">Upload your certificates</div>
            <div class="file-upload-hint">PDF, DOC, or images up to 10MB each</div>
            <input type="file" id="certificates" name="certificates" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display: none;">
          </div>
          <div class="file-list" id="fileList"></div>
        </div>
      `;
    }

    dynamicFields.innerHTML = fieldsHTML;

    // Re-setup file uploads for partner role
    if (this.currentRole === "partner") {
      this.setupFileUploads();
    }
  }

  updateFormLabels() {
    const submitBtn = document.getElementById("submitBtn");
    const formTitle = document.querySelector(".auth-title");

    if (this.currentPage === "signup" && submitBtn) {
      if (this.currentRole === "partner") {
        submitBtn.textContent = "Request Partnership";
      } else {
        submitBtn.textContent = "Create Account";
      }
    }

    // Update page title based on role
    if (formTitle && this.currentPage === "signup") {
      const roleNames = {
        learner: "Start Learning Japanese",
        partner: "Become a Teaching Partner",
        admin: "Admin Access",
      };
      formTitle.textContent = roleNames[this.currentRole] || "Create Account";
    }
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll(".form-input");

    inputs.forEach((input) => {
      // Real-time validation on input
      input.addEventListener("input", () => {
        this.validateField(input);
      });

      // Validation on blur
      input.addEventListener("blur", () => {
        this.validateField(input);
      });
    });

    // Password strength meter
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      passwordInput.addEventListener("input", () => {
        this.updatePasswordStrength(passwordInput.value);
      });
    }

    // Confirm password validation
    const confirmPasswordInput = document.getElementById("confirmPassword");
    if (confirmPasswordInput && passwordInput) {
      confirmPasswordInput.addEventListener("input", () => {
        this.validatePasswordConfirm(
          passwordInput.value,
          confirmPasswordInput.value,
        );
      });
    }
  }

  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name || input.id;
    let isValid = true;
    let message = "";

    // Clear previous validation
    this.clearFieldValidation(input);

    if (input.hasAttribute("required") && !value) {
      isValid = false;
      message = "This field is required";
    } else if (fieldName === "email" && value) {
      if (!this.validationRules.email.test(value)) {
        isValid = false;
        message = "Please enter a valid email address";
      }
    } else if (fieldName === "password" && value) {
      const passwordValidation = this.validatePassword(value);
      if (!passwordValidation.isValid) {
        isValid = false;
        message = passwordValidation.message;
      }
    }

    // Apply validation styling
    if (value) {
      if (isValid) {
        this.showFieldSuccess(input);
      } else {
        this.showFieldError(input, message);
      }
    }

    return isValid;
  }

  validatePassword(password) {
    const rules = this.validationRules.password;
    const issues = [];

    if (password.length < rules.minLength) {
      issues.push(`at least ${rules.minLength} characters`);
    }
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      issues.push("an uppercase letter");
    }
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      issues.push("a lowercase letter");
    }
    if (rules.requireNumbers && !/\d/.test(password)) {
      issues.push("a number");
    }
    if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push("a special character");
    }

    return {
      isValid: issues.length === 0,
      message:
        issues.length > 0 ? `Password must include ${issues.join(", ")}` : "",
      strength: this.calculatePasswordStrength(password),
    };
  }

  calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    if (score <= 2) return "weak";
    if (score <= 3) return "fair";
    if (score <= 4) return "good";
    return "strong";
  }

  updatePasswordStrength(password) {
    const strengthMeter = document.querySelector(".strength-fill");
    const strengthText = document.querySelector(".strength-text");

    if (!strengthMeter || !strengthText) return;

    const strength = this.calculatePasswordStrength(password);

    // Update meter
    strengthMeter.className = `strength-fill ${strength}`;

    // Update text
    const strengthLabels = {
      weak: "Weak",
      fair: "Fair",
      good: "Good",
      strong: "Strong",
    };

    strengthText.textContent = `Password strength: ${strengthLabels[strength]}`;
    strengthText.className = `strength-text ${strength}`;
  }

  validatePasswordConfirm(password, confirmPassword) {
    const confirmInput = document.getElementById("confirmPassword");
    if (!confirmInput) return;

    this.clearFieldValidation(confirmInput);

    if (confirmPassword && password !== confirmPassword) {
      this.showFieldError(confirmInput, "Passwords do not match");
      return false;
    } else if (confirmPassword && password === confirmPassword) {
      this.showFieldSuccess(confirmInput);
      return true;
    }

    return true;
  }

  showFieldError(input, message) {
    input.classList.remove("success");
    input.classList.add("error");

    const icon = input.parentNode.querySelector(".input-icon");
    if (icon) {
      icon.innerHTML = "✕";
      icon.className = "input-icon error";
    }

    // Show error message
    const existingError = input.parentNode.querySelector(".field-error");
    if (!existingError) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "field-error";
      errorDiv.innerHTML = `<span>⚠️</span> ${message}`;
      input.parentNode.appendChild(errorDiv);
    }
  }

  showFieldSuccess(input) {
    input.classList.remove("error");
    input.classList.add("success");

    const icon = input.parentNode.querySelector(".input-icon");
    if (icon) {
      icon.innerHTML = "✓";
      icon.className = "input-icon success";
    }
  }

  clearFieldValidation(input) {
    input.classList.remove("error", "success");

    const icon = input.parentNode.querySelector(".input-icon");
    if (icon) {
      icon.innerHTML = "";
      icon.className = "input-icon";
    }

    const existingError = input.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    const existingSuccess = input.parentNode.querySelector(".field-success");
    if (existingSuccess) {
      existingSuccess.remove();
    }
  }

  setupSocialButtons() {
    const socialButtons = document.querySelectorAll(".social-btn");

    socialButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const provider = btn.dataset.provider;
        this.handleSocialLogin(provider);
      });
    });
  }

  handleSocialLogin(provider) {
    Toast.info(`${provider} login would be implemented here`);

    // Simulate social login
    setTimeout(() => {
      this.handleSuccessfulAuth({
        name: "Social User",
        email: `user@${provider.toLowerCase()}.com`,
        role: this.currentRole,
      });
    }, 1000);
  }

  setupDemoCards() {
    const demoCards = document.querySelectorAll(".demo-card");

    demoCards.forEach((card) => {
      card.addEventListener("click", () => {
        const demoType = card.dataset.demo;
        this.fillDemoCredentials(demoType);
      });
    });
  }

  fillDemoCredentials(demoType) {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const demoCredentials = {
      learner: {
        email: "demo.learner@nihongosekai.com",
        password: "DemoLearner123!",
      },
      partner: {
        email: "demo.partner@nihongosekai.com",
        password: "DemoPartner123!",
      },
      admin: {
        email: "demo.admin@nihongosekai.com",
        password: "DemoAdmin123!",
      },
    };

    const credentials = demoCredentials[demoType];
    if (credentials && emailInput && passwordInput) {
      emailInput.value = credentials.email;
      passwordInput.value = credentials.password;

      // Trigger validation
      this.validateField(emailInput);
      this.validateField(passwordInput);

      Toast.success(`Demo ${demoType} credentials filled!`);
    }
  }

  setupFileUploads() {
    const fileUpload = document.getElementById("certificateUpload");
    const fileInput = document.getElementById("certificates");
    const fileList = document.getElementById("fileList");

    if (!fileUpload || !fileInput) return;

    // Click to upload
    fileUpload.addEventListener("click", () => {
      fileInput.click();
    });

    // Drag and drop
    fileUpload.addEventListener("dragover", (e) => {
      e.preventDefault();
      fileUpload.classList.add("dragover");
    });

    fileUpload.addEventListener("dragleave", () => {
      fileUpload.classList.remove("dragover");
    });

    fileUpload.addEventListener("drop", (e) => {
      e.preventDefault();
      fileUpload.classList.remove("dragover");

      const files = Array.from(e.dataTransfer.files);
      this.handleFileSelection(files, fileList);
    });

    // File input change
    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      this.handleFileSelection(files, fileList);
    });
  }

  handleFileSelection(files, fileListContainer) {
    if (!fileListContainer) return;

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        Toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const fileItem = document.createElement("div");
      fileItem.className = "file-item";
      fileItem.innerHTML = `
        <span>${file.name} (${this.formatFileSize(file.size)})</span>
        <span class="file-remove" onclick="this.parentElement.remove()">×</span>
      `;

      fileListContainer.appendChild(fileItem);
    });

    Toast.success(`${files.length} file(s) added successfully`);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  setupFormSubmission() {
    const form = document.getElementById("authForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
  }

  async handleFormSubmit(form) {
    if (this.isLoading) return;

    // Validate all fields
    const inputs = form.querySelectorAll(".form-input[required]");
    let isValid = true;
    let firstInvalidField = null;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = input;
        }
      }
    });

    // Special validation for partner role
    if (this.currentPage === "signup" && this.currentRole === "partner") {
      const experienceSelect = document.getElementById("experience");
      if (experienceSelect && !experienceSelect.value) {
        this.showFieldError(
          experienceSelect,
          "Please select your experience level",
        );
        isValid = false;
        if (!firstInvalidField) firstInvalidField = experienceSelect;
      }
    }

    if (!isValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.classList.add("error");

        // Trigger shake animation
        setTimeout(() => {
          firstInvalidField.classList.remove("error");
        }, 500);
      }
      Toast.error("Please correct the errors before submitting");
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get form data
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());
      userData.role = this.currentRole;

      if (this.currentPage === "signin") {
        this.handleSuccessfulAuth(userData);
      } else {
        this.handleSuccessfulSignup(userData);
      }
    } catch (error) {
      Toast.error("An error occurred. Please try again.");
      console.error("Auth error:", error);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
    const submitBtn = document.getElementById("submitBtn");

    if (submitBtn) {
      if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add("loading");
        submitBtn.innerHTML = `
          <span class="btn-loading-spinner"></span>
          ${this.currentPage === "signin" ? "Signing In..." : "Creating Account..."}
        `;
      } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        const originalText =
          this.currentRole === "partner" && this.currentPage === "signup"
            ? "Request Partnership"
            : this.currentPage === "signin"
              ? "Sign In"
              : "Create Account";
        submitBtn.textContent = originalText;
      }
    }
  }

  handleSuccessfulAuth(userData) {
    // Store user data
    StorageManager.set("user_logged_in", true);
    StorageManager.set("user_data", userData);
    StorageManager.set("auth_token", "demo_token_" + Date.now());

    Toast.success(`Welcome${userData.name ? ", " + userData.name : ""}!`);

    // Role-based redirect
    setTimeout(() => {
      const redirectUrls = {
        learner: "../html/learner-dashboard.html",
        partner: "../html/partner-dashboard.html",
        admin: "../html/admin-dashboard.html",
      };

      window.location.href =
        redirectUrls[userData.role] || "../html/index.html";
    }, 1000);
  }

  handleSuccessfulSignup(userData) {
    if (userData.role === "partner") {
      // Redirect to confirmation page for partners
      this.showPartnerConfirmation();
    } else {
      // Auto-login for learners and admins
      this.handleSuccessfulAuth(userData);
    }
  }

  showPartnerConfirmation() {
    const authContainer = document.querySelector(".auth-container");
    if (authContainer) {
      authContainer.innerHTML = `
        <div class="confirmation-page">
          <div class="confirmation-icon">✅</div>
          <h2 class="confirmation-title">Request Received!</h2>
          <p class="confirmation-message">
            Thank you for your partnership application! We'll review your qualifications 
            and email you within 2-3 business days when your account is approved.
          </p>
          <div class="confirmation-actions">
            <a href="../html/index.html" class="btn btn-primary">Return to Home</a>
            <a href="../html/login.html" class="btn btn-outline">Sign In</a>
          </div>
        </div>
      `;
    }
  }
}

// Initialize authentication system
let authSystem;

document.addEventListener("DOMContentLoaded", () => {
  authSystem = new AuthSystem();

  // Auto-focus first input
  const firstInput = document.querySelector(".form-input");
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 300);
  }
});

// Global functions for inline event handlers
function switchToRole(role) {
  if (authSystem) {
    const roleIndex = { learner: 0, partner: 1, admin: 2 }[role] || 0;
    authSystem.switchRole(role, roleIndex);
  }
}

function tryDemo(type) {
  if (authSystem) {
    authSystem.fillDemoCredentials(type);
  }
}
