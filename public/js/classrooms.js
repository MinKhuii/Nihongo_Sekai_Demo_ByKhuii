/**
 * Classrooms Page JavaScript
 * Handles classroom listing, filtering, and live session management
 */

class ClassroomsPage {
  constructor() {
    this.allClassrooms = [];
    this.filteredClassrooms = [];
    this.currentFilters = {
      search: "",
      level: "",
      status: "",
      time: "",
    };

    this.init();
  }

  init() {
    this.loadClassrooms();
    this.setupEventListeners();
    this.setupSakuraEffect();
    this.startLiveUpdates();
  }

  async loadClassrooms() {
    try {
      // Show loading state
      this.showLoading();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load 5 new dummy sessions with varying schedules/capacity
      this.allClassrooms = [
        {
          id: 1,
          title: "Morning Conversation Circle",
          instructor: "Yuki Tanaka",
          level: "Intermediate",
          price: 25.0,
          maxStudents: 8,
          enrolledStudents: 6,
          schedule: {
            days: ["Monday", "Wednesday", "Friday"],
            time: "09:00",
            timezone: "JST",
            duration: 60,
          },
          nextSession: "2024-01-20T09:00:00Z",
          status: "upcoming",
          image: "☀️",
          description:
            "Start your day with friendly Japanese conversations in a supportive group environment. Perfect for intermediate learners.",
          isEnrolled: this.checkEnrollment(1),
        },
        {
          id: 2,
          title: "Weekend Cultural Exchange",
          instructor: "Mai Suzuki",
          level: "All Levels",
          price: 30.0,
          maxStudents: 12,
          enrolledStudents: 9,
          schedule: {
            days: ["Saturday"],
            time: "14:00",
            timezone: "JST",
            duration: 90,
          },
          nextSession: "2024-01-21T14:00:00Z",
          status: "upcoming",
          image: "🎎",
          description:
            "Explore Japanese culture while practicing language skills with native speakers and fellow learners from around the world.",
          isEnrolled: this.checkEnrollment(2),
        },
        {
          id: 3,
          title: "Business Japanese Workshop",
          instructor: "Kenji Yamamoto",
          level: "Advanced",
          price: 45.0,
          maxStudents: 6,
          enrolledStudents: 6,
          schedule: {
            days: ["Tuesday", "Thursday"],
            time: "19:00",
            timezone: "JST",
            duration: 75,
          },
          nextSession: "2024-01-19T19:00:00Z",
          status: "full",
          image: "💼",
          description:
            "Master professional Japanese communication for business environments, presentations, and formal meetings.",
          isEnrolled: this.checkEnrollment(3),
        },
        {
          id: 4,
          title: "Anime Japanese Study Group",
          instructor: "Shinji Ikari",
          level: "Beginner",
          price: 20.0,
          maxStudents: 15,
          enrolledStudents: 11,
          schedule: {
            days: ["Sunday"],
            time: "16:00",
            timezone: "JST",
            duration: 60,
          },
          nextSession: "2024-01-22T16:00:00Z",
          status: "upcoming",
          image: "🎭",
          description:
            "Learn Japanese through popular anime and manga while understanding cultural references and casual expressions.",
          isEnrolled: this.checkEnrollment(4),
        },
        {
          id: 5,
          title: "Evening Pronunciation Practice",
          instructor: "Emiko Yoshida",
          level: "Elementary",
          price: 22.0,
          maxStudents: 10,
          enrolledStudents: 7,
          schedule: {
            days: ["Monday", "Wednesday"],
            time: "20:00",
            timezone: "JST",
            duration: 45,
          },
          nextSession: "2024-01-19T20:00:00Z",
          status: "live",
          image: "🗣️",
          description:
            "Perfect your Japanese pronunciation with native speaker techniques and detailed phonetic training in small groups.",
          isEnrolled: this.checkEnrollment(5),
        },
      ];

      this.filteredClassrooms = [...this.allClassrooms];
      this.renderClassrooms();
    } catch (error) {
      console.error("Error loading classrooms:", error);
      this.showError("Failed to load classrooms. Please try again.");
    }
  }

  checkEnrollment(classroomId) {
    // Mock enrollment data
    const enrolledClassrooms = [2, 5]; // User is enrolled in classrooms 2 and 5
    const user = Utils.getCurrentUser();
    return user && enrolledClassrooms.includes(classroomId);
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("classroomSearch");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        Utils.debounce((e) => {
          this.currentFilters.search = e.target.value;
          this.applyFilters();
        }, 300),
      );
    }

    // Filter selects
    const levelFilter = document.getElementById("levelFilter");
    const statusFilter = document.getElementById("statusFilter");
    const timeFilter = document.getElementById("timeFilter");

    if (levelFilter) {
      levelFilter.addEventListener("change", (e) => {
        this.currentFilters.level = e.target.value;
        this.applyFilters();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.currentFilters.status = e.target.value;
        this.applyFilters();
      });
    }

    if (timeFilter) {
      timeFilter.addEventListener("change", (e) => {
        this.currentFilters.time = e.target.value;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    this.filteredClassrooms = this.allClassrooms.filter((classroom) => {
      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const matchesSearch =
          classroom.title.toLowerCase().includes(searchTerm) ||
          classroom.instructor.toLowerCase().includes(searchTerm) ||
          classroom.description.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Level filter
      if (
        this.currentFilters.level &&
        classroom.level !== this.currentFilters.level
      ) {
        return false;
      }

      // Status filter
      if (
        this.currentFilters.status &&
        classroom.status !== this.currentFilters.status
      ) {
        return false;
      }

      // Time filter
      if (this.currentFilters.time) {
        const sessionHour = parseInt(classroom.schedule.time.split(":")[0]);
        switch (this.currentFilters.time) {
          case "morning":
            if (sessionHour < 6 || sessionHour >= 12) return false;
            break;
          case "afternoon":
            if (sessionHour < 12 || sessionHour >= 18) return false;
            break;
          case "evening":
            if (sessionHour < 18 || sessionHour >= 24) return false;
            break;
        }
      }

      return true;
    });

    this.renderClassrooms();
  }

  renderClassrooms() {
    const container = document.getElementById("classroomsGrid");
    if (!container) return;

    if (this.filteredClassrooms.length === 0) {
      this.showEmpty();
      return;
    }

    const classroomsHTML = this.filteredClassrooms
      .map(
        (classroom) => `
      <div class="classroom-card animate-on-scroll" data-classroom-id="${classroom.id}">
        ${classroom.isEnrolled ? '<div class="enrolled-badge">Enrolled</div>' : ""}
        <div class="level-badge ${classroom.level.toLowerCase().replace(" ", "-")}">${classroom.level}</div>
        <div class="status-badge ${classroom.status}">${this.getStatusText(classroom.status)}</div>

        <div class="classroom-card-image">
          <span style="font-size: 3.5rem;">${classroom.image}</span>
        </div>

        <div class="classroom-card-content">
          <div class="classroom-card-header">
            <h3 class="classroom-title">${classroom.title}</h3>
            <div class="classroom-instructor">
              <div class="instructor-avatar">
                ${classroom.instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span>by ${classroom.instructor}</span>
            </div>
          </div>

          <div class="classroom-meta">
            <div class="meta-item">
              <span class="meta-icon">🕒</span>
              <span>${classroom.schedule.time} ${classroom.schedule.timezone}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">⏱️</span>
              <span>${classroom.schedule.duration} minutes</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span>${classroom.schedule.days.join(", ")}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">👥</span>
              <span>${classroom.enrolledStudents}/${classroom.maxStudents} students</span>
            </div>
          </div>

          <p class="classroom-description">${classroom.description}</p>

          <div class="classroom-schedule">
            <div class="schedule-title">Next Session</div>
            <div class="schedule-details">
              ${this.formatNextSession(classroom.nextSession)}
              <div class="next-session">${this.getTimeUntilSession(classroom.nextSession)}</div>
            </div>
          </div>

          <div class="classroom-stats">
            <div class="capacity-info">
              <span>Capacity:</span>
              <div class="capacity-bar">
                <div class="capacity-fill" style="width: ${(classroom.enrolledStudents / classroom.maxStudents) * 100}%"></div>
              </div>
              <span>${classroom.enrolledStudents}/${classroom.maxStudents}</span>
            </div>
            <div class="classroom-price">$${classroom.price}</div>
          </div>

          <div class="classroom-footer">
            ${this.getActionButton(classroom)}
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    container.innerHTML = classroomsHTML;

    // Add staggered animation
    const cards = container.querySelectorAll(".classroom-card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";

      setTimeout(() => {
        card.style.transition = "all 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 150);
    });
  }

  getStatusText(status) {
    const statusMap = {
      live: "LIVE NOW",
      upcoming: "Upcoming",
      full: "Full",
    };
    return statusMap[status] || status;
  }

  getActionButton(classroom) {
    if (classroom.status === "full" && !classroom.isEnrolled) {
      return `
        <button class="btn btn-secondary classroom-action" disabled>
          Classroom Full
        </button>
      `;
    }

    if (classroom.isEnrolled) {
      if (classroom.status === "live") {
        return `
            <a href="classrooms-detail.html?id=${classroom.id}" class="btn btn-primary classroom-action">
              🔴 Join Live Session
            </a>
        `;
      } else {
        return `
          <a href="classrooms-detail.html?id=${classroom.id}" class="btn btn-primary classroom-action">
            View Classroom
          </a>
        `;
      }
    }

    return `
      <a href="classrooms-detail.html?id=${classroom.id}" class="btn btn-primary classroom-action">
        Join Classroom
      </a>
    `;
  }

  formatNextSession(sessionDateTime) {
    const date = new Date(sessionDateTime);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US", options);
  }

  getTimeUntilSession(sessionDateTime) {
    const now = new Date();
    const session = new Date(sessionDateTime);
    const diff = session - now;

    if (diff < 0) return "Session has started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `Starts in ${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Starts in ${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
    } else {
      return `Starts in ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  startLiveUpdates() {
    // Update time until session every minute
    setInterval(() => {
      const timeElements = document.querySelectorAll(".next-session");
      timeElements.forEach((element, index) => {
        if (this.filteredClassrooms[index]) {
          element.textContent = this.getTimeUntilSession(
            this.filteredClassrooms[index].nextSession,
          );
        }
      });
    }, 60000);

    // Simulate status changes for demo
    setInterval(() => {
      this.updateLiveStatus();
    }, 30000);
  }

  updateLiveStatus() {
    // Simulate some status changes for demo purposes
    const now = new Date();
    this.allClassrooms.forEach((classroom) => {
      const sessionTime = new Date(classroom.nextSession);
      const timeDiff = sessionTime - now;

      if (
        timeDiff <= 0 &&
        timeDiff > -classroom.schedule.duration * 60 * 1000
      ) {
        classroom.status = "live";
      } else if (timeDiff > 0) {
        classroom.status = "upcoming";
      }
    });

    // Re-apply filters and render if status changed
    this.applyFilters();
  }

  showLoading() {
    const container = document.getElementById("classroomsGrid");
    if (container) {
      container.innerHTML = `
        <div class="classrooms-loading">
          <div class="loading-spinner"></div>
          <p>Loading live classrooms...</p>
        </div>
      `;
    }
  }

  showEmpty() {
    const container = document.getElementById("classroomsGrid");
    if (container) {
      container.innerHTML = `
        <div class="classrooms-empty">
          <div class="empty-icon">🎓</div>
          <h3 class="empty-title">No classrooms found</h3>
          <p class="empty-description">
            Try adjusting your filters to find the perfect live classroom for you.
          </p>
          <button class="btn btn-primary" onclick="classroomsPage.clearFilters()">
            Clear Filters
          </button>
        </div>
      `;
    }
  }

  showError(message) {
    const container = document.getElementById("classroomsGrid");
    if (container) {
      container.innerHTML = `
        <div class="classrooms-empty">
          <div class="empty-icon">⚠️</div>
          <h3 class="empty-title">Error Loading Classrooms</h3>
          <p class="empty-description">${message}</p>
          <button class="btn btn-primary" onclick="classroomsPage.loadClassrooms()">
            Try Again
          </button>
        </div>
      `;
    }
  }

  clearFilters() {
    // Reset all filters
    this.currentFilters = {
      search: "",
      level: "",
      status: "",
      time: "",
    };

    // Reset form elements
    const searchInput = document.getElementById("classroomSearch");
    const levelFilter = document.getElementById("levelFilter");
    const statusFilter = document.getElementById("statusFilter");
    const timeFilter = document.getElementById("timeFilter");

    if (searchInput) searchInput.value = "";
    if (levelFilter) levelFilter.value = "";
    if (statusFilter) statusFilter.value = "";
    if (timeFilter) timeFilter.value = "";

    // Reapply filters
    this.applyFilters();
  }

  setupSakuraEffect() {
    const container = document.getElementById("sakuraContainer");
    if (!container) return;

    const createSakuraPetal = () => {
      const petal = document.createElement("div");
      petal.className = "sakura-petal";

      petal.style.left = Math.random() * 100 + "%";
      const size = Math.random() * 6 + 4;
      petal.style.width = size + "px";
      petal.style.height = size + "px";

      const duration = Math.random() * 15 + 10;
      petal.style.animationDuration = duration + "s";
      petal.style.animationDelay = Math.random() * 3 + "s";

      container.appendChild(petal);

      setTimeout(
        () => {
          if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
          }
        },
        (duration + 3) * 1000,
      );
    };

    // Create initial petals
    for (let i = 0; i < 8; i++) {
      setTimeout(createSakuraPetal, i * 1000);
    }

    // Continuously create new petals
    setInterval(createSakuraPetal, 5000);
  }
}

// Global reference for onclick handlers
let classroomsPage;

// Global function to handle classroom clicks
function joinClassroom(classroomId) {
  const classroom = classroomsPage.allClassrooms.find(
    (c) => c.id === classroomId,
  );
  if (classroom) {
    if (classroom.isEnrolled) {
      window.location.href = `classrooms-detail.html?id=${classroomId}&action=join`;
    } else {
      window.location.href = `classrooms-detail.html?id=${classroomId}`;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  classroomsPage = new ClassroomsPage();
});
