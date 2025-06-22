/**
 * Classroom Detail Page JavaScript
 * Handles classroom details, scheduling, and join functionality
 */

class ClassroomDetailPage {
  constructor() {
    this.classroomId = this.getClassroomIdFromUrl();
    this.classroomData = null;
    this.currentTab = "overview";
    this.countdownInterval = null;

    this.init();
  }

  init() {
    if (!this.classroomId) {
      this.showError("Classroom not found");
      return;
    }

    this.loadClassroomData();
    this.setupTabs();
    this.setupModals();
    this.setupEventListeners();
  }

  getClassroomIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      urlParams.get("id") ||
      window.location.pathname.split("/").pop().replace(".html", "")
    );
  }

  async loadClassroomData() {
    try {
      // Show loading state
      this.showLoading();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock classroom data based on ID
      const classrooms = {
        1: {
          id: 1,
          title: "Morning Conversation Circle",
          subtitle:
            "Start your day with friendly Japanese conversations in a supportive group environment",
          description:
            "Join our popular morning conversation circle where intermediate learners practice real-world Japanese in a relaxed, encouraging atmosphere. Led by certified native speaker Yuki Tanaka, each session focuses on practical vocabulary, natural expressions, and cultural insights that help you sound more like a native speaker.",
          instructor: {
            id: 1,
            name: "Yuki Tanaka",
            title: "Certified Japanese Instructor",
            avatar:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=YukiSensei&backgroundColor=b6e3f4",
            bio: "Native Japanese speaker with 6 years of teaching experience. Specializes in conversational Japanese and cultural exchange.",
            rating: 4.9,
            students: 180,
            experience: "6 years",
          },
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
          nextSession: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: "upcoming",
          image: "☀️",
          features: [
            {
              icon: "💬",
              title: "Real Conversation Practice",
              description:
                "Practice authentic Japanese conversations with fellow learners and native speakers",
            },
            {
              icon: "🎯",
              title: "Targeted Learning",
              description:
                "Focus on practical vocabulary and expressions used in daily Japanese life",
            },
            {
              icon: "🤝",
              title: "Supportive Environment",
              description:
                "Learn in a safe, encouraging space where mistakes are welcome and celebrated",
            },
            {
              icon: "📚",
              title: "Cultural Insights",
              description:
                "Gain deep understanding of Japanese culture and social customs",
            },
          ],
          isEnrolled: this.checkEnrollment(1),
        },
        2: {
          id: 2,
          title: "Weekend Cultural Exchange",
          subtitle:
            "Explore Japanese culture while practicing language skills with native speakers and fellow learners",
          description:
            "Immerse yourself in Japanese culture through our weekend cultural exchange sessions. Perfect for all levels, these interactive classes combine language practice with cultural exploration, covering everything from traditional customs to modern Japanese lifestyle.",
          instructor: {
            id: 2,
            name: "Mai Suzuki",
            title: "Cultural Studies Expert",
            avatar:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=MaiSensei&backgroundColor=fce7f3",
            bio: "Cultural anthropologist and Japanese language teacher with expertise in traditional and modern Japanese culture.",
            rating: 4.8,
            students: 210,
            experience: "7 years",
          },
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
          nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          status: "upcoming",
          image: "🎎",
          features: [
            {
              icon: "🎭",
              title: "Cultural Immersion",
              description:
                "Learn about Japanese traditions, festivals, and modern culture firsthand",
            },
            {
              icon: "🗾",
              title: "Virtual Japan Tours",
              description:
                "Explore different regions of Japan through virtual tours and local insights",
            },
            {
              icon: "🍜",
              title: "Food & Language",
              description:
                "Discover Japanese cuisine while learning food-related vocabulary and etiquette",
            },
            {
              icon: "🎌",
              title: "Language in Context",
              description:
                "Practice Japanese as it's naturally used in various cultural situations",
            },
          ],
          isEnrolled: this.checkEnrollment(2),
        },
        3: {
          id: 3,
          title: "Business Japanese Workshop",
          subtitle:
            "Master professional Japanese communication for business environments and formal meetings",
          description:
            "Advance your career with our comprehensive business Japanese workshop. Learn the formal language, etiquette, and communication styles essential for professional success in Japanese business environments.",
          instructor: {
            id: 3,
            name: "Kenji Yamamoto",
            title: "Business Japanese Specialist",
            avatar:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=KenjiSensei&backgroundColor=c0aede",
            bio: "Former corporate executive turned language instructor, specializing in business Japanese and professional communication.",
            rating: 4.7,
            students: 320,
            experience: "10 years",
          },
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
          nextSession: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
          status: "full",
          image: "💼",
          features: [
            {
              icon: "📊",
              title: "Business Presentations",
              description:
                "Learn to deliver effective presentations in Japanese business settings",
            },
            {
              icon: "🤝",
              title: "Meeting Etiquette",
              description:
                "Master the proper protocols and language for Japanese business meetings",
            },
            {
              icon: "📧",
              title: "Professional Writing",
              description:
                "Develop skills in writing formal emails, reports, and business documents",
            },
            {
              icon: "💼",
              title: "Networking Skills",
              description:
                "Build confidence in Japanese business networking and relationship building",
            },
          ],
          isEnrolled: this.checkEnrollment(3),
        },
      };

      this.classroomData = classrooms[this.classroomId];

      if (!this.classroomData) {
        this.showError("Classroom not found");
        return;
      }

      this.renderClassroomData();
      this.startCountdown();
    } catch (error) {
      console.error("Error loading classroom:", error);
      this.showError("Failed to load classroom details. Please try again.");
    }
  }

  checkEnrollment(classroomId) {
    // Mock enrollment data
    const enrolledClassrooms = [2, 5]; // User is enrolled in classrooms 2 and 5
    const user = Utils.getCurrentUser();
    return user && enrolledClassrooms.includes(classroomId);
  }

  renderClassroomData() {
    const classroom = this.classroomData;

    // Update page title
    document.title = `${classroom.title} - Nihongo Sekai`;

    // Render hero section
    this.renderHeroSection(classroom);

    // Render main content
    this.renderMainContent(classroom);

    // Render sidebar
    this.renderSidebar(classroom);
  }

  renderHeroSection(classroom) {
    const heroContainer = document.querySelector(".hero-content");
    if (!heroContainer) return;

    heroContainer.innerHTML = `
      <div class="hero-info">
        <div class="classroom-breadcrumb">
          <a href="classrooms.html" class="breadcrumb-link">Classrooms</a>
          <span>›</span>
          <span>${classroom.title}</span>
        </div>
        
        <h1 class="classroom-title">${classroom.title}</h1>
        <p class="classroom-subtitle">${classroom.subtitle}</p>
        
        <div class="hero-meta">
          <div class="meta-item">
            <span class="meta-icon">👨‍🏫</span>
            <span>${classroom.instructor.name}</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">📊</span>
            <span>${classroom.level}</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">👥</span>
            <span>${classroom.enrolledStudents}/${classroom.maxStudents} students</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">⏱️</span>
            <span>${classroom.schedule.duration} minutes</span>
          </div>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="classroom-thumbnail">
          <div class="status-badges">
            <div class="status-badge ${classroom.status}">${this.getStatusText(classroom.status)}</div>
            <div class="level-badge">${classroom.level}</div>
          </div>
          <div class="thumbnail-overlay">
            <span style="font-size: 6rem;">${classroom.image}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderMainContent(classroom) {
    // Render overview tab
    const overviewPanel = document.getElementById("overview");
    if (overviewPanel) {
      overviewPanel.innerHTML = `
        <p class="description-text">${classroom.description}</p>
        
        <h3 style="margin-bottom: var(--spacing-lg); color: var(--color-gray-900);">What You'll Experience</h3>
        <ul class="feature-list">
          ${classroom.features
            .map(
              (feature) => `
            <li class="feature-item">
              <div class="feature-icon">${feature.icon}</div>
              <div class="feature-content">
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
              </div>
            </li>
          `,
            )
            .join("")}
        </ul>
      `;
    }

    // Render schedule tab
    const schedulePanel = document.getElementById("schedule");
    if (schedulePanel) {
      schedulePanel.innerHTML = `
        <div class="next-session-info">
          <div class="next-session-title">Next Session</div>
          <div class="countdown-timer" id="countdownTimer">Loading...</div>
          <div class="session-details">
            ${this.formatDateTime(classroom.nextSession)} (${classroom.schedule.timezone})
          </div>
        </div>
        
        <h3 style="margin-bottom: var(--spacing-lg); color: var(--color-gray-900);">Weekly Schedule</h3>
        <div class="schedule-grid">
          ${classroom.schedule.days
            .map(
              (day) => `
            <div class="schedule-card ${this.isNextSessionDay(day, classroom.nextSession) ? "next-session" : ""}">
              <div class="schedule-day">${day}</div>
              <div class="schedule-time">${classroom.schedule.time} ${classroom.schedule.timezone}</div>
              <div class="schedule-status">${classroom.schedule.duration} minutes</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    }
  }

  renderSidebar(classroom) {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    sidebar.innerHTML = `
      <!-- Instructor Card -->
      <div class="sidebar-card">
        <h3 class="card-title">Your Instructor</h3>
        <div class="instructor-profile">
          <div class="instructor-avatar">
            <img src="${classroom.instructor.avatar}" alt="${classroom.instructor.name}" />
          </div>
          <div class="instructor-info">
            <h3>${classroom.instructor.name}</h3>
            <div class="instructor-title">${classroom.instructor.title}</div>
            <div class="instructor-rating">
              <span>⭐ ${classroom.instructor.rating}</span>
              <span>(${classroom.instructor.students} students)</span>
            </div>
          </div>
        </div>
        
        <p class="instructor-bio">${classroom.instructor.bio}</p>
        
        <div class="instructor-stats">
          <div class="stat-item">
            <div class="stat-number">${classroom.instructor.experience}</div>
            <div class="stat-label">Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${classroom.instructor.students}</div>
            <div class="stat-label">Students</div>
          </div>
        </div>
      </div>

      <!-- Pricing & Enrollment Card -->
      <div class="sidebar-card">
        <div class="pricing-info">
          <div class="price-amount">$${classroom.price}</div>
          <div class="price-period">per session</div>
        </div>
        
        <div class="capacity-info">
          <h4 style="margin-bottom: var(--spacing-sm); color: var(--color-gray-900);">Class Capacity</h4>
          <div class="capacity-bar">
            <div class="capacity-fill" style="width: ${(classroom.enrolledStudents / classroom.maxStudents) * 100}%"></div>
          </div>
          <div class="capacity-text">
            <span>${classroom.enrolledStudents} enrolled</span>
            <span>${classroom.maxStudents} max</span>
          </div>
        </div>
        
        <div class="action-buttons">
          ${this.getActionButton(classroom)}
          <button class="btn secondary-btn" onclick="classroomDetail.shareClassroom()">
            📤 Share Classroom
          </button>
        </div>
      </div>
    `;
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
        <button class="btn join-btn" disabled style="opacity: 0.6; cursor: not-allowed;">
          Classroom Full
        </button>
      `;
    }

    if (classroom.isEnrolled) {
      if (classroom.status === "live") {
        return `
          <button class="btn join-btn live" onclick="classroomDetail.joinLiveSession()">
            🔴 Join Live Session
          </button>
        `;
      } else {
        return `
          <button class="btn join-btn upcoming" onclick="classroomDetail.showJoinModal()">
            View Classroom Details
          </button>
        `;
      }
    }

    return `
      <button class="btn join-btn upcoming" onclick="classroomDetail.showJoinModal()">
        ${classroom.status === "live" ? "🔴 Join Live Now" : "Join Classroom"} - $${classroom.price}
      </button>
    `;
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.dataset.tab;

        // Remove active class from all tabs and panels
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanels.forEach((panel) => panel.classList.remove("active"));

        // Add active class to clicked tab and corresponding panel
        button.classList.add("active");
        const targetPanel = document.getElementById(tabId);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }

        this.currentTab = tabId;
      });
    });
  }

  setupModals() {
    const modal = document.getElementById("joinModal");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelJoin");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.hideJoinModal();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.hideJoinModal();
      });
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideJoinModal();
        }
      });
    }
  }

  setupEventListeners() {
    // Handle escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideJoinModal();
      }
    });

    // Handle back navigation
    window.addEventListener("popstate", () => {
      window.location.href = "classrooms.html";
    });
  }

  showJoinModal() {
    const modal = document.getElementById("joinModal");
    const modalBody = document.querySelector(".modal-body");

    if (!modal || !this.classroomData) return;

    // Update modal content
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="classroom-info">
          <div class="info-row">
            <span class="info-label">Classroom:</span>
            <span class="info-value">${this.classroomData.title}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Instructor:</span>
            <span class="info-value">${this.classroomData.instructor.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Next Session:</span>
            <span class="info-value">${this.formatDateTime(this.classroomData.nextSession)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Duration:</span>
            <span class="info-value">${this.classroomData.schedule.duration} minutes</span>
          </div>
          <div class="info-row">
            <span class="info-label">Price:</span>
            <span class="info-value">$${this.classroomData.price} per session</span>
          </div>
        </div>
        
        <p style="color: var(--color-gray-600); line-height: 1.6; margin-bottom: var(--spacing-lg);">
          ${
            this.classroomData.isEnrolled
              ? "You are enrolled in this classroom. Ready to join the session?"
              : "Join this classroom to start learning with expert instruction and fellow students."
          }
        </p>
        
        <div class="modal-actions">
          <button class="btn btn-outline" id="cancelJoin">Cancel</button>
          <button class="btn btn-primary" onclick="classroomDetail.confirmJoin()">
            ${this.classroomData.isEnrolled ? "Enter Classroom" : "Join Classroom"}
          </button>
        </div>
      `;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  hideJoinModal() {
    const modal = document.getElementById("joinModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  confirmJoin() {
    if (this.classroomData.isEnrolled) {
      this.enterClassroom();
    } else {
      this.enrollInClassroom();
    }
  }

  enrollInClassroom() {
    this.hideJoinModal();

    // Show loading state
    Toast.info("Processing enrollment...");

    // Simulate enrollment process
    setTimeout(() => {
      Toast.success("Successfully enrolled in classroom!");

      // Update enrollment status
      this.classroomData.isEnrolled = true;
      this.classroomData.enrolledStudents += 1;

      // Re-render sidebar with updated state
      this.renderSidebar(this.classroomData);

      // Optionally redirect to video call or dashboard
      setTimeout(() => {
        this.enterClassroom();
      }, 1500);
    }, 2000);
  }

  enterClassroom() {
    this.hideJoinModal();

    if (this.classroomData.status === "live") {
      this.joinLiveSession();
    } else {
      Toast.info("Redirecting to classroom dashboard...");
      setTimeout(() => {
        window.location.href = `classroom-session.html?id=${this.classroomId}`;
      }, 1000);
    }
  }

  joinLiveSession() {
    Toast.success("Connecting to live session...");

    // Simulate connection delay
    setTimeout(() => {
      window.location.href = `classroom-live.html?id=${this.classroomId}&action=join`;
    }, 1500);
  }

  shareClassroom() {
    if (navigator.share) {
      navigator.share({
        title: this.classroomData.title,
        text: this.classroomData.subtitle,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        Toast.success("Classroom link copied to clipboard!");
      });
    }
  }

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const nextSession = new Date(this.classroomData.nextSession);
      const diff = nextSession - now;

      if (diff <= 0) {
        // Session has started
        this.classroomData.status = "live";
        this.renderSidebar(this.classroomData);
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let countdownText = "";
      if (days > 0) {
        countdownText = `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        countdownText = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        countdownText = `${minutes}m ${seconds}s`;
      }

      const countdownElement = document.getElementById("countdownTimer");
      if (countdownElement) {
        countdownElement.textContent = countdownText;
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  formatDateTime(date) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  isNextSessionDay(day, nextSession) {
    const sessionDay = new Date(nextSession).toLocaleDateString("en-US", {
      weekday: "long",
    });
    return day === sessionDay;
  }

  showLoading() {
    const container = document.querySelector(".main-content");
    if (container) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: var(--spacing-3xl); color: var(--color-gray-600);">
          <div style="text-align: center;">
            <div style="width: 48px; height: 48px; border: 4px solid var(--color-gray-200); border-top: 4px solid var(--color-primary-600); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto var(--spacing-lg);"></div>
            <p>Loading classroom details...</p>
          </div>
        </div>
      `;
    }
  }

  showError(message) {
    const container = document.querySelector(".classroom-content .container");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-600);">
          <div style="font-size: 4rem; margin-bottom: var(--spacing-lg);">⚠️</div>
          <h2 style="color: var(--color-gray-900); margin-bottom: var(--spacing-md);">Error Loading Classroom</h2>
          <p style="margin-bottom: var(--spacing-lg);">${message}</p>
          <a href="classrooms.html" class="btn btn-primary">Back to Classrooms</a>
        </div>
      `;
    }
  }
}

// Global reference for onclick handlers
let classroomDetail;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  classroomDetail = new ClassroomDetailPage();
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (classroomDetail && classroomDetail.countdownInterval) {
    clearInterval(classroomDetail.countdownInterval);
  }
});
