// Cards Component JavaScript

class CardsComponent {
  constructor() {
    this.courseCards = document.querySelectorAll(".course-card");
    this.classroomCards = document.querySelectorAll(".classroom-card");
    this.coursesContainer = document.getElementById("featuredCourses");
    this.classroomsContainer = document.getElementById("popularClassrooms");

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupCardInteractions();
    this.setupLiveStatusUpdates();
    this.loadDynamicContent();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("fade-in");
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    // Observe all cards
    [...this.courseCards, ...this.classroomCards].forEach((card) => {
      observer.observe(card);
    });
  }

  setupCardInteractions() {
    // Course cards interactions
    this.courseCards.forEach((card) => {
      this.setupCardHover(card);
      this.setupCardClick(card);
    });

    // Classroom cards interactions
    this.classroomCards.forEach((card) => {
      this.setupCardHover(card);
      this.setupCardClick(card);
    });
  }

  setupCardHover(card) {
    const image = card.querySelector(".course-img, .classroom-img");
    const overlay = card.querySelector(".card-overlay");
    const button = overlay ? overlay.querySelector(".btn") : null;

    card.addEventListener("mouseenter", () => {
      this.animateCardHover(card, true);
      if (button) {
        this.animateButton(button, true);
      }
    });

    card.addEventListener("mouseleave", () => {
      this.animateCardHover(card, false);
      if (button) {
        this.animateButton(button, false);
      }
    });
  }

  setupCardClick(card) {
    card.addEventListener("click", (e) => {
      // Only trigger if not clicking on buttons or links
      if (!e.target.closest(".btn") && !e.target.closest("a")) {
        const link = card.querySelector(".card-overlay .btn");
        if (link) {
          window.location.href = link.getAttribute("href");
        }
      }
    });
  }

  animateCardHover(card, isHovering) {
    const image = card.querySelector(".course-img, .classroom-img");

    if (isHovering) {
      card.style.transform = "translateY(-8px)";
      card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
      if (image) {
        image.style.transform = "scale(1.05)";
      }
    } else {
      card.style.transform = "";
      card.style.boxShadow = "";
      if (image) {
        image.style.transform = "";
      }
    }
  }

  animateButton(button, isHovering) {
    if (isHovering) {
      button.style.transform = "translateY(-2px)";
      button.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
    } else {
      button.style.transform = "";
      button.style.boxShadow = "";
    }
  }

  setupLiveStatusUpdates() {
    // Update live status indicators every 30 seconds
    setInterval(() => {
      this.updateLiveStatus();
    }, 30000);
  }

  updateLiveStatus() {
    const liveStatuses = document.querySelectorAll(".card-status.live");

    liveStatuses.forEach((status) => {
      // Simulate live status updates
      const isStillLive = Math.random() > 0.1; // 90% chance to stay live

      if (!isStillLive) {
        status.textContent = "Recently Ended";
        status.classList.remove("live");
        status.classList.add("ended");
        status.style.background = "#6b7280";
      }
    });
  }

  loadDynamicContent() {
    // This method would typically fetch data from an API
    // For now, we'll use static data but structure it as if it came from an API

    const featuredCourses = [
      {
        id: 1,
        title: "Japanese for Beginners",
        description:
          "Master the fundamentals of Japanese language with our comprehensive beginner course.",
        image: "/assets/course-1.jpg",
        instructor: {
          name: "Tanaka Sensei",
          avatar: "/assets/instructor-1.jpg",
        },
        level: "Beginner",
        rating: 4.9,
        price: { current: 49.99, original: 79.99 },
        students: 2340,
        link: "/courses/japanese-for-beginners",
      },
      {
        id: 2,
        title: "Business Japanese",
        description:
          "Professional Japanese communication skills for the modern workplace.",
        image: "/assets/course-2.jpg",
        instructor: {
          name: "Yamamoto Sensei",
          avatar: "/assets/instructor-2.jpg",
        },
        level: "Intermediate",
        rating: 4.8,
        price: { current: 89.99 },
        students: 1120,
        link: "/courses/business-japanese",
      },
      {
        id: 3,
        title: "JLPT N3 Preparation",
        description:
          "Comprehensive preparation for the Japanese Language Proficiency Test N3 level.",
        image: "/assets/course-3.jpg",
        instructor: {
          name: "Sato Sensei",
          avatar: "/assets/instructor-3.jpg",
        },
        level: "Advanced",
        rating: 4.9,
        price: { current: 129.99 },
        students: 890,
        link: "/courses/jlpt-n3-prep",
      },
    ];

    const popularClassrooms = [
      {
        id: 1,
        title: "Morning Conversation Circle",
        description:
          "Start your day with friendly Japanese conversation practice.",
        image: "/assets/classroom-1.jpg",
        instructor: {
          name: "Tanaka Sensei",
          avatar: "/assets/instructor-1.jpg",
        },
        schedule: "Mon, Wed, Fri 9:00 AM JST",
        participants: { current: 6, max: 8 },
        price: 25.0,
        status: "live",
        link: "/classrooms/morning-conversation",
      },
      {
        id: 2,
        title: "Weekend Cultural Exchange",
        description:
          "Explore Japanese culture while practicing conversation skills.",
        image: "/assets/classroom-2.jpg",
        instructor: {
          name: "Yamamoto Sensei",
          avatar: "/assets/instructor-2.jpg",
        },
        schedule: "Saturday 2:00 PM JST",
        participants: { current: 9, max: 12 },
        price: 30.0,
        status: "upcoming",
        link: "/classrooms/cultural-exchange",
      },
    ];

    // In a real application, you would render these dynamically
    // For now, the static HTML is used, but this structure shows how it would work
  }

  // Utility methods for dynamic rendering (if needed)
  createCourseCard(course) {
    return `
      <div class="course-card">
        <div class="card-image">
          <img src="${course.image}" alt="${course.title}" class="course-img" />
          <div class="card-badge ${course.level.toLowerCase()}">${course.level}</div>
          <div class="card-overlay">
            <a href="${course.link}" class="btn btn-white">Learn More</a>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${course.title}</h3>
          <p class="card-description">${course.description}</p>
          <div class="card-meta">
            <div class="card-instructor">
              <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="instructor-avatar" />
              <span>${course.instructor.name}</span>
            </div>
            <div class="card-rating">
              <span class="rating-stars">${"★".repeat(Math.floor(course.rating))}</span>
              <span class="rating-text">${course.rating}</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="card-price">
              <span class="price-current">$${course.price.current}</span>
              ${course.price.original ? `<span class="price-original">$${course.price.original}</span>` : ""}
            </div>
            <div class="card-students">${course.students.toLocaleString()} students</div>
          </div>
        </div>
      </div>
    `;
  }

  createClassroomCard(classroom) {
    const statusClass = classroom.status === "live" ? "live" : "upcoming";
    const statusText =
      classroom.status === "live" ? "Live Now" : "Starting Soon";

    return `
      <div class="classroom-card">
        <div class="card-image">
          <img src="${classroom.image}" alt="${classroom.title}" class="classroom-img" />
          <div class="card-status ${statusClass}">${statusText}</div>
          <div class="card-overlay">
            <a href="${classroom.link}" class="btn btn-white">View Details</a>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${classroom.title}</h3>
          <p class="card-description">${classroom.description}</p>
          <div class="card-schedule">
            <div class="schedule-time">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              ${classroom.schedule}
            </div>
            <div class="schedule-participants">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m22 21-3-3" />
              </svg>
              ${classroom.participants.current}/${classroom.participants.max} participants
            </div>
          </div>
          <div class="card-footer">
            <div class="card-instructor">
              <img src="${classroom.instructor.avatar}" alt="${classroom.instructor.name}" class="instructor-avatar" />
              <span>${classroom.instructor.name}</span>
            </div>
            <div class="card-price">$${classroom.price.toFixed(2)}/session</div>
          </div>
        </div>
      </div>
    `;
  }

  // Public methods for external control
  refreshContent() {
    this.loadDynamicContent();
  }

  updateCardData(cardId, newData) {
    // Method to update specific card data
    const card = document.querySelector(`[data-card-id="${cardId}"]`);
    if (card && newData) {
      // Update card content based on newData
      // Implementation would depend on specific requirements
    }
  }
}

// Initialize cards component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cards = new CardsComponent();
});

// Export for Builder.io or other usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = CardsComponent;
}
