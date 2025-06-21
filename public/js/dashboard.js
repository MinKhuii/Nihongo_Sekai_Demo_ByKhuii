// Dashboard Shared JavaScript - Profile Dropdown & Utilities

class DashboardManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.initializeProfileDropdown();
    this.initializeAnimations();
    this.initializeChartAnimations();
  }

  getCurrentUser() {
    // Get user data from localStorage/sessionStorage
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      return JSON.parse(userData);
    }

    // Default demo user for development
    return {
      id: 1,
      name: "Demo User",
      email: "demo@nihongosekai.com",
      role: "learner", // learner, partner, admin
      avatar: null,
      isOnline: true,
    };
  }

  initializeProfileDropdown() {
    // Update navigation to include profile dropdown
    this.updateNavigation();

    // Add click event listeners
    document.addEventListener("click", (e) => {
      const dropdown = document.querySelector(".profile-dropdown");
      if (!dropdown) return;

      if (e.target.closest(".profile-avatar")) {
        dropdown.classList.toggle("active");
      } else if (!e.target.closest(".profile-dropdown-menu")) {
        dropdown.classList.remove("active");
      }
    });

    // Add logout confirmation
    document.addEventListener("click", (e) => {
      if (e.target.closest(".profile-menu-item.logout")) {
        e.preventDefault();
        this.showLogoutConfirmation();
      }
    });
  }

  updateNavigation() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions || document.querySelector(".profile-dropdown")) return;

    // Replace sign in/get started buttons with profile dropdown
    const profileDropdown = this.createProfileDropdown();
    navActions.innerHTML = "";
    navActions.appendChild(profileDropdown);
  }

  createProfileDropdown() {
    const dropdown = document.createElement("div");
    dropdown.className = "profile-dropdown";

    const avatar = document.createElement("div");
    avatar.className = "profile-avatar";

    if (this.currentUser.avatar) {
      const img = document.createElement("img");
      img.src = this.currentUser.avatar;
      img.alt = this.currentUser.name;
      img.className = "profile-avatar-img";
      avatar.appendChild(img);
    } else {
      const initials = document.createElement("span");
      initials.className = "profile-avatar-text";
      initials.textContent = this.currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      avatar.appendChild(initials);
    }

    if (this.currentUser.isOnline) {
      const indicator = document.createElement("div");
      indicator.className = "online-indicator";
      avatar.appendChild(indicator);
    }

    const menu = document.createElement("div");
    menu.className = "profile-dropdown-menu";
    menu.innerHTML = this.getMenuItems();

    dropdown.appendChild(avatar);
    dropdown.appendChild(menu);

    return dropdown;
  }

  getMenuItems() {
    const baseItems = ["My Profile", "Settings"];
    let roleSpecificItems = [];

    switch (this.currentUser.role) {
      case "learner":
        roleSpecificItems = ["My Courses", "My Classrooms", "Transactions"];
        break;
      case "partner":
        roleSpecificItems = ["My Classrooms"];
        break;
      case "admin":
        roleSpecificItems = ["Dashboard"];
        break;
    }

    const allItems = ["My Profile", ...roleSpecificItems, "Settings"];

    return (
      allItems
        .map((item) => {
          const href = this.getItemHref(item);
          const icon = this.getItemIcon(item);
          return `<a href="${href}" class="profile-menu-item">
        <span>${icon}</span>
        ${item}
      </a>`;
        })
        .join("") +
      `<a href="#" class="profile-menu-item logout">
      <span>🚪</span>
      Log out
    </a>`
    );
  }

  getItemHref(item) {
    const baseUrl = "../html/";
    const itemMap = {
      "My Profile": `${this.currentUser.role}-profile.html`,
      "My Courses": "learner-courses.html",
      "My Classrooms": `${this.currentUser.role}-classrooms.html`,
      Transactions: "learner-transactions.html",
      Dashboard: "admin-dashboard.html",
      Settings: `${this.currentUser.role}-settings.html`,
    };
    return itemMap[item] || "#";
  }

  getItemIcon(item) {
    const iconMap = {
      "My Profile": "👤",
      "My Courses": "📚",
      "My Classrooms": "🏫",
      Transactions: "💳",
      Dashboard: "📊",
      Settings: "⚙️",
    };
    return iconMap[item] || "📄";
  }

  showLogoutConfirmation() {
    // Use global ToastManager if available, otherwise create modal
    if (window.ToastManager) {
      const confirmed = confirm("Are you sure you want to log out?");
      if (confirmed) {
        this.logout();
      }
    } else {
      this.createLogoutModal();
    }
  }

  createLogoutModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out of your account?</p>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-danger" onclick="window.dashboardManager.logout()">Log Out</button>
        </div>
      </div>
    `;

    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    document.body.appendChild(modal);
  }

  logout() {
    // Clear user data
    localStorage.removeItem("currentUser");
    sessionStorage.clear();

    // Redirect to login
    window.location.href = "../html/login.html";
  }

  initializeAnimations() {
    // Initialize fade-in animations for dashboard elements
    const elements = document.querySelectorAll(
      ".dashboard-card, .chart-container",
    );
    elements.forEach((el, index) => {
      el.classList.add("fade-in", `delay-${Math.min(index + 1, 4)}`);
    });

    // Initialize progress bar animations
    setTimeout(() => {
      this.animateProgressBars();
    }, 500);
  }

  animateProgressBars() {
    const progressBars = document.querySelectorAll(".progress-bar");
    progressBars.forEach((bar) => {
      const width = bar.getAttribute("data-width") || "0%";
      bar.style.width = width;
    });
  }

  initializeChartAnimations() {
    // Add intersection observer for chart animations
    if ("IntersectionObserver" in window) {
      const chartObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-chart");
            }
          });
        },
        { threshold: 0.3 },
      );

      document.querySelectorAll(".chart-container").forEach((chart) => {
        chartObserver.observe(chart);
      });
    }
  }

  // Utility methods for dashboard data
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  }

  calculateProgress(current, total) {
    return Math.round((current / total) * 100);
  }

  getRandomColor() {
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
      "#ffecd2",
      "#fcb69f",
      "#a8edea",
      "#fed6e3",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Dashboard data generators for demo purposes
class DashboardDataGenerator {
  static generateCourseProgress() {
    return [
      {
        id: 1,
        title: "Japanese for Beginners",
        progress: 75,
        lastAccessed: "2024-01-15",
        totalLessons: 24,
        completedLessons: 18,
        nextLesson: "Hiragana Practice 3",
      },
      {
        id: 2,
        title: "Conversational Japanese",
        progress: 45,
        lastAccessed: "2024-01-14",
        totalLessons: 32,
        completedLessons: 14,
        nextLesson: "Daily Conversations",
      },
      {
        id: 3,
        title: "Business Japanese Mastery",
        progress: 20,
        lastAccessed: "2024-01-12",
        totalLessons: 40,
        completedLessons: 8,
        nextLesson: "Formal Greetings",
      },
    ];
  }

  static generateClassroomSessions() {
    return [
      {
        id: 1,
        title: "Morning Conversation Circle",
        nextSession: "2024-01-16T09:00:00",
        instructor: "Tanaka-sensei",
        status: "upcoming",
        participants: 6,
      },
      {
        id: 2,
        title: "Weekend Cultural Exchange",
        nextSession: "2024-01-20T14:00:00",
        instructor: "Yamamoto-sensei",
        status: "upcoming",
        participants: 9,
      },
      {
        id: 3,
        title: "Evening Pronunciation Practice",
        nextSession: "2024-01-16T20:00:00",
        instructor: "Sato-sensei",
        status: "live",
        participants: 7,
      },
    ];
  }

  static generateTransactions() {
    return [
      {
        id: "TXN-001",
        date: "2024-01-15",
        amount: 49.99,
        description: "Japanese for Beginners Course",
        status: "completed",
        invoice: "invoice-001.pdf",
      },
      {
        id: "TXN-002",
        date: "2024-01-10",
        amount: 79.99,
        description: "Conversational Japanese Course",
        status: "completed",
        invoice: "invoice-002.pdf",
      },
      {
        id: "TXN-003",
        date: "2024-01-08",
        amount: 25.0,
        description: "Morning Conversation Circle (4 sessions)",
        status: "completed",
        invoice: "invoice-003.pdf",
      },
    ];
  }

  static generatePartnerClassrooms() {
    return [
      {
        id: 1,
        title: "Morning Conversation Circle",
        students: 6,
        maxStudents: 8,
        schedule: "Mon, Wed, Fri 9:00 AM JST",
        revenue: 150.0,
        status: "active",
      },
      {
        id: 2,
        title: "Weekend Cultural Exchange",
        students: 9,
        maxStudents: 12,
        schedule: "Saturday 2:00 PM JST",
        revenue: 270.0,
        status: "active",
      },
      {
        id: 3,
        title: "Advanced Grammar Workshop",
        students: 0,
        maxStudents: 6,
        schedule: "Tuesday 7:00 PM JST",
        revenue: 0,
        status: "draft",
      },
    ];
  }

  static generateAdminStats() {
    return {
      totalUsers: 1247,
      totalCourses: 15,
      totalClassrooms: 8,
      totalRevenue: 12450.0,
      monthlyGrowth: 15.6,
      activeUsers: 892,
      coursesCompleted: 234,
      upcomingSessions: 12,
    };
  }
}

// Initialize dashboard on page load
document.addEventListener("DOMContentLoaded", () => {
  window.dashboardManager = new DashboardManager();
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DashboardManager, DashboardDataGenerator };
}
