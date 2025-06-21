/**
 * Courses Page JavaScript
 * Handles course listing, filtering, search, and pagination
 */

class CoursesPage {
  constructor() {
    this.allCourses = [];
    this.filteredCourses = [];
    this.currentPage = 1;
    this.coursesPerPage = 6;
    this.currentFilters = {
      search: "",
      level: "",
      category: "",
      price: "",
      rating: "",
    };
    this.currentSort = "popular";

    this.init();
  }

  init() {
    this.loadCourses();
    this.setupEventListeners();
    this.setupSakuraEffect();
  }

  async loadCourses() {
    try {
      // Show loading state
      this.showLoading();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load 10 new dummy courses with varying levels/tuition/ratings
      this.allCourses = [
        {
          id: 1,
          title: "Japanese for Beginners",
          instructor: "Hiroshi Tanaka",
          level: "Beginner",
          category: "General",
          price: 49.99,
          students: 1205,
          rating: 4.8,
          lessons: 24,
          duration: "6 weeks",
          image: "🎌",
          description:
            "Start your Japanese journey with comprehensive basics covering hiragana, katakana, and essential vocabulary for daily conversations.",
          isEnrolled: this.checkEnrollment(1),
        },
        {
          id: 2,
          title: "Conversational Japanese",
          instructor: "Akiko Sato",
          level: "Intermediate",
          category: "Conversation",
          price: 79.99,
          students: 856,
          rating: 4.9,
          lessons: 36,
          duration: "8 weeks",
          image: "💬",
          description:
            "Master everyday conversations and natural speech patterns used by native Japanese speakers in real-world situations.",
          isEnrolled: this.checkEnrollment(2),
        },
        {
          id: 3,
          title: "Business Japanese Mastery",
          instructor: "Kenji Yamamoto",
          level: "Advanced",
          category: "Business",
          price: 129.99,
          students: 423,
          rating: 4.7,
          lessons: 48,
          duration: "12 weeks",
          image: "💼",
          description:
            "Professional Japanese communication for business meetings, presentations, and formal correspondence in corporate environments.",
          isEnrolled: this.checkEnrollment(3),
        },
        {
          id: 4,
          title: "Japanese Grammar Essentials",
          instructor: "Yuki Nakamura",
          level: "Elementary",
          category: "Grammar",
          price: 59.99,
          students: 1089,
          rating: 4.6,
          lessons: 30,
          duration: "7 weeks",
          image: "📝",
          description:
            "Master fundamental Japanese grammar structures and patterns essential for building solid language foundations.",
          isEnrolled: this.checkEnrollment(4),
        },
        {
          id: 5,
          title: "JLPT N3 Preparation",
          instructor: "Tomoko Watanabe",
          level: "Intermediate",
          category: "Test Prep",
          price: 89.99,
          students: 734,
          rating: 4.8,
          lessons: 42,
          duration: "10 weeks",
          image: "📋",
          description:
            "Comprehensive preparation course for JLPT N3 exam covering all sections: vocabulary, grammar, reading, and listening.",
          isEnrolled: this.checkEnrollment(5),
        },
        {
          id: 6,
          title: "Anime & Manga Japanese",
          instructor: "Shinji Ikari",
          level: "Beginner",
          category: "Culture",
          price: 39.99,
          students: 2103,
          rating: 4.9,
          lessons: 20,
          duration: "5 weeks",
          image: "🎭",
          description:
            "Learn Japanese through popular anime and manga, understanding cultural references and casual expressions.",
          isEnrolled: this.checkEnrollment(6),
        },
        {
          id: 7,
          title: "Japanese Cooking & Culture",
          instructor: "Michiko Suzuki",
          level: "Elementary",
          category: "Culture",
          price: 69.99,
          students: 567,
          rating: 4.7,
          lessons: 28,
          duration: "8 weeks",
          image: "🍱",
          description:
            "Explore Japanese culture through cooking while learning food-related vocabulary and dining etiquette.",
          isEnrolled: this.checkEnrollment(7),
        },
        {
          id: 8,
          title: "Travel Japanese Bootcamp",
          instructor: "Ryo Taniguchi",
          level: "Beginner",
          category: "Travel",
          price: 45.99,
          students: 1456,
          rating: 4.5,
          lessons: 18,
          duration: "4 weeks",
          image: "✈️",
          description:
            "Essential phrases and vocabulary for traveling in Japan, from airports to hotels to local attractions.",
          isEnrolled: this.checkEnrollment(8),
        },
        {
          id: 9,
          title: "Advanced Kanji Mastery",
          instructor: "Satoshi Nakajima",
          level: "Advanced",
          category: "Writing",
          price: 99.99,
          students: 298,
          rating: 4.9,
          lessons: 50,
          duration: "14 weeks",
          image: "🖋️",
          description:
            "Master complex kanji characters, their readings, and usage in advanced Japanese texts and literature.",
          isEnrolled: this.checkEnrollment(9),
        },
        {
          id: 10,
          title: "Japanese Pronunciation Perfect",
          instructor: "Emiko Yoshida",
          level: "Elementary",
          category: "Pronunciation",
          price: 55.99,
          students: 823,
          rating: 4.8,
          lessons: 25,
          duration: "6 weeks",
          image: "🗣️",
          description:
            "Perfect your Japanese pronunciation with native speaker techniques and detailed phonetic training.",
          isEnrolled: this.checkEnrollment(10),
        },
      ];

      this.filteredCourses = [...this.allCourses];
      this.renderCourses();
      this.updatePagination();
    } catch (error) {
      console.error("Error loading courses:", error);
      this.showError("Failed to load courses. Please try again.");
    }
  }

  checkEnrollment(courseId) {
    // Mock enrollment data
    const enrolledCourses = [1, 6]; // User is enrolled in courses 1 and 6
    const user = Utils.getCurrentUser();
    return user && enrolledCourses.includes(courseId);
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("courseSearch");
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
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const sortSelect = document.getElementById("sortSelect");

    if (levelFilter) {
      levelFilter.addEventListener("change", (e) => {
        this.currentFilters.level = e.target.value;
        this.applyFilters();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.currentFilters.category = e.target.value;
        this.applyFilters();
      });
    }

    if (priceFilter) {
      priceFilter.addEventListener("change", (e) => {
        this.currentFilters.price = e.target.value;
        this.applyFilters();
      });
    }

    if (ratingFilter) {
      ratingFilter.addEventListener("change", (e) => {
        this.currentFilters.rating = e.target.value;
        this.applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applySorting();
        this.renderCourses();
        this.updatePagination();
      });
    }
  }

  applyFilters() {
    this.filteredCourses = this.allCourses.filter((course) => {
      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm) ||
          course.instructor.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Level filter
      if (
        this.currentFilters.level &&
        course.level !== this.currentFilters.level
      ) {
        return false;
      }

      // Category filter
      if (
        this.currentFilters.category &&
        course.category !== this.currentFilters.category
      ) {
        return false;
      }

      // Price filter
      if (this.currentFilters.price) {
        const price = course.price;
        switch (this.currentFilters.price) {
          case "free":
            if (price !== 0) return false;
            break;
          case "under50":
            if (price >= 50) return false;
            break;
          case "50to100":
            if (price < 50 || price > 100) return false;
            break;
          case "over100":
            if (price <= 100) return false;
            break;
        }
      }

      // Rating filter
      if (this.currentFilters.rating) {
        const minRating = parseFloat(this.currentFilters.rating);
        if (course.rating < minRating) return false;
      }

      return true;
    });

    this.applySorting();
    this.currentPage = 1;
    this.renderCourses();
    this.updatePagination();
  }

  applySorting() {
    switch (this.currentSort) {
      case "title":
        this.filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price-low":
        this.filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        this.filteredCourses.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        this.filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case "students":
        this.filteredCourses.sort((a, b) => b.students - a.students);
        break;
      case "newest":
        this.filteredCourses.sort((a, b) => b.id - a.id);
        break;
      case "popular":
      default:
        this.filteredCourses.sort((a, b) => b.students - a.students);
        break;
    }
  }

  renderCourses() {
    const container = document.getElementById("coursesGrid");
    if (!container) return;

    const startIndex = (this.currentPage - 1) * this.coursesPerPage;
    const endIndex = startIndex + this.coursesPerPage;
    const coursesToShow = this.filteredCourses.slice(startIndex, endIndex);

    if (coursesToShow.length === 0) {
      this.showEmpty();
      return;
    }

    const coursesHTML = coursesToShow
      .map(
        (course) => `
      <div class="course-card animate-on-scroll" data-course-id="${course.id}">
        ${course.isEnrolled ? '<div class="purchased-badge">Enrolled</div>' : ""}
        <div class="level-badge ${course.level.toLowerCase()}">${course.level}</div>
        
        <div class="course-card-image">
          <span style="font-size: 4rem;">${course.image}</span>
        </div>
        
        <div class="course-card-content">
          <div class="course-card-header">
            <h3 class="course-title">${course.title}</h3>
            <div class="course-instructor">
              <div class="instructor-avatar">
                ${course.instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span>by ${course.instructor}</span>
            </div>
          </div>

          <div class="course-meta">
            <div class="meta-item">
              <span class="meta-icon">📚</span>
              <span>${course.lessons} lessons</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">⏱️</span>
              <span>${course.duration}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📊</span>
              <span>${course.category}</span>
            </div>
          </div>

          <p class="course-description">${course.description}</p>

          <div class="course-stats">
            <div class="course-rating">
              <span class="rating-stars">${this.generateStars(course.rating)}</span>
              <span class="rating-value">${course.rating}</span>
              <span class="rating-count">(${course.students})</span>
            </div>
            <div class="course-students">
              ${course.students.toLocaleString()} students
            </div>
          </div>

          <div class="course-footer">
            <div class="course-price">$${course.price}</div>
            <a href="course-detail.html?id=${course.id}" class="btn btn-primary course-action">
              ${course.isEnrolled ? "Continue Learning" : "View Course"}
            </a>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    container.innerHTML = coursesHTML;

    // Add staggered animation
    const cards = container.querySelectorAll(".course-card");
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

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += "★";
    }

    if (hasHalfStar) {
      stars += "☆";
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars += "☆";
    }

    return stars;
  }

  updatePagination() {
    const totalPages = Math.ceil(
      this.filteredCourses.length / this.coursesPerPage,
    );
    const container = document.getElementById("pagination");

    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = "";
      return;
    }

    let paginationHTML = "";

    // Previous button
    if (this.currentPage > 1) {
      paginationHTML += `
        <button class="pagination-btn" onclick="coursesPage.changePage(${this.currentPage - 1})">
          ← Previous
        </button>
      `;
    } else {
      paginationHTML += `
        <button class="pagination-btn" disabled>
          ← Previous
        </button>
      `;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === this.currentPage) {
        paginationHTML += `
          <button class="pagination-btn active">${i}</button>
        `;
      } else {
        paginationHTML += `
          <button class="pagination-btn" onclick="coursesPage.changePage(${i})">
            ${i}
          </button>
        `;
      }
    }

    // Next button
    if (this.currentPage < totalPages) {
      paginationHTML += `
        <button class="pagination-btn" onclick="coursesPage.changePage(${this.currentPage + 1})">
          Next →
        </button>
      `;
    } else {
      paginationHTML += `
        <button class="pagination-btn" disabled>
          Next →
        </button>
      `;
    }

    container.innerHTML = paginationHTML;
  }

  changePage(page) {
    this.currentPage = page;
    this.renderCourses();
    this.updatePagination();

    // Scroll to top of courses section
    const coursesSection = document.querySelector(".courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  showLoading() {
    const container = document.getElementById("coursesGrid");
    if (container) {
      container.innerHTML = `
        <div class="courses-loading">
          <div class="loading-spinner"></div>
          <p>Loading amazing courses...</p>
        </div>
      `;
    }
  }

  showEmpty() {
    const container = document.getElementById("coursesGrid");
    if (container) {
      container.innerHTML = `
        <div class="courses-empty">
          <div class="empty-icon">📚</div>
          <h3 class="empty-title">No courses found</h3>
          <p class="empty-description">
            Try adjusting your filters or search terms to find the perfect course for you.
          </p>
          <button class="btn btn-primary" onclick="coursesPage.clearFilters()">
            Clear Filters
          </button>
        </div>
      `;
    }
  }

  showError(message) {
    const container = document.getElementById("coursesGrid");
    if (container) {
      container.innerHTML = `
        <div class="courses-empty">
          <div class="empty-icon">⚠️</div>
          <h3 class="empty-title">Error Loading Courses</h3>
          <p class="empty-description">${message}</p>
          <button class="btn btn-primary" onclick="coursesPage.loadCourses()">
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
      category: "",
      price: "",
      rating: "",
    };

    // Reset form elements
    const searchInput = document.getElementById("courseSearch");
    const levelFilter = document.getElementById("levelFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const ratingFilter = document.getElementById("ratingFilter");

    if (searchInput) searchInput.value = "";
    if (levelFilter) levelFilter.value = "";
    if (categoryFilter) categoryFilter.value = "";
    if (priceFilter) priceFilter.value = "";
    if (ratingFilter) ratingFilter.value = "";

    // Reapply filters (which will show all courses)
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
    for (let i = 0; i < 10; i++) {
      setTimeout(createSakuraPetal, i * 800);
    }

    // Continuously create new petals
    setInterval(createSakuraPetal, 4000);
  }
}

// Global reference for onclick handlers
let coursesPage;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  coursesPage = new CoursesPage();
});
