/**
 * Admin Management System for Nihongo Sekai
 * Provides CRUD interfaces for courses, classrooms, partners, and learners
 */

class AdminManagement {
  constructor() {
    this.currentSection = "analytics";
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchQuery = "";
    this.sortBy = "created_at";
    this.sortOrder = "desc";
    this.filters = {};

    this.init();
  }

  init() {
    this.setupSidebarNavigation();
    this.setupGlobalSearch();
    this.loadAnalytics();
  }

  // Setup sidebar navigation
  setupSidebarNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach((l) => l.classList.remove("active"));

        // Add active class to clicked link
        link.classList.add("active");

        // Get section from href or onclick
        const section =
          link.getAttribute("onclick")?.match(/loadSection\('(.+)'\)/)?.[1] ||
          "analytics";
        this.loadSection(section);
      });
    });
  }

  // Setup global search functionality
  setupGlobalSearch() {
    const searchInput = document.getElementById("globalSearch");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        this.debounce((e) => {
          this.searchQuery = e.target.value;
          this.currentPage = 1;
          this.loadSection(this.currentSection);
        }, 300),
      );
    }
  }

  // Load different sections
  loadSection(section) {
    this.currentSection = section;
    this.currentPage = 1;
    this.searchQuery = "";

    // Hide all sections
    const sections = document.querySelectorAll('[id$="Section"]');
    sections.forEach((s) => (s.style.display = "none"));

    // Show analytics section
    const analyticsSection = document.querySelector(".analytics-overview");
    if (analyticsSection) {
      analyticsSection.style.display =
        section === "analytics" ? "block" : "none";
    }

    switch (section) {
      case "analytics":
        this.loadAnalytics();
        break;
      case "courses":
        this.loadCourses();
        break;
      case "classrooms":
        this.loadClassrooms();
        break;
      case "partners":
        this.loadPartners();
        break;
      case "learners":
        this.loadLearners();
        break;
      case "orders":
        this.loadOrders();
        break;
      default:
        this.loadAnalytics();
    }
  }

  // Load analytics dashboard
  loadAnalytics() {
    // Analytics content is already loaded in the HTML
    console.log("Analytics dashboard loaded");
  }

  // Load courses management
  loadCourses() {
    const container = this.getOrCreateSection("courses");
    container.innerHTML = `
      <div class="management-header">
        <div class="header-left">
          <h2>Courses Management</h2>
          <p>Manage all courses and their content</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="adminManager.showCreateCourseModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Course
          </button>
        </div>
      </div>

      <div class="management-filters">
        <div class="filter-group">
          <select id="courseStatusFilter" class="filter-select" onchange="adminManager.applyFilters('courses')">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          
          <select id="courseLevelFilter" class="filter-select" onchange="adminManager.applyFilters('courses')">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          
          <input type="text" id="courseSearchInput" placeholder="Search courses..." class="search-input" 
                 oninput="adminManager.handleSearch('courses')">
        </div>
        
        <div class="filter-actions">
          <button class="btn btn-outline" onclick="adminManager.exportData('courses')">Export CSV</button>
          <button class="btn btn-outline" onclick="adminManager.clearFilters('courses')">Clear Filters</button>
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th onclick="adminManager.sortTable('title')">
                Title <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('teacher')">
                Teacher <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('level')">
                Level <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('price')">
                Price <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('students')">
                Students <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('rating')">
                Rating <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('status')">
                Status <span class="sort-icon">↕️</span>
              </th>
              <th onclick="adminManager.sortTable('created_at')">
                Created <span class="sort-icon">↕️</span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="coursesTableBody">
            ${this.renderCoursesTable()}
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        ${this.renderPagination()}
      </div>
    `;
  }

  // Load classrooms management
  loadClassrooms() {
    const container = this.getOrCreateSection("classrooms");
    container.innerHTML = `
      <div class="management-header">
        <div class="header-left">
          <h2>Classrooms Management</h2>
          <p>Manage live classrooms and sessions</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="adminManager.showCreateClassroomModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Classroom
          </button>
        </div>
      </div>

      <div class="management-filters">
        <div class="filter-group">
          <select id="classroomStatusFilter" class="filter-select" onchange="adminManager.applyFilters('classrooms')">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="full">Full</option>
          </select>
          
          <select id="classroomLevelFilter" class="filter-select" onchange="adminManager.applyFilters('classrooms')">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          
          <input type="text" id="classroomSearchInput" placeholder="Search classrooms..." class="search-input" 
                 oninput="adminManager.handleSearch('classrooms')">
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th onclick="adminManager.sortTable('title')">Title</th>
              <th onclick="adminManager.sortTable('teacher')">Teacher</th>
              <th onclick="adminManager.sortTable('level')">Level</th>
              <th onclick="adminManager.sortTable('price')">Price</th>
              <th onclick="adminManager.sortTable('capacity')">Capacity</th>
              <th onclick="adminManager.sortTable('enrolled')">Enrolled</th>
              <th onclick="adminManager.sortTable('status')">Status</th>
              <th onclick="adminManager.sortTable('next_session')">Next Session</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="classroomsTableBody">
            ${this.renderClassroomsTable()}
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        ${this.renderPagination()}
      </div>
    `;
  }

  // Load partners management
  loadPartners() {
    const container = this.getOrCreateSection("partners");
    container.innerHTML = `
      <div class="management-header">
        <div class="header-left">
          <h2>Partners Management</h2>
          <p>Manage teacher partners and their profiles</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="adminManager.showInvitePartnerModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Invite Partner
          </button>
        </div>
      </div>

      <div class="management-filters">
        <div class="filter-group">
          <select id="partnerStatusFilter" class="filter-select" onchange="adminManager.applyFilters('partners')">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select id="partnerSpecializationFilter" class="filter-select" onchange="adminManager.applyFilters('partners')">
            <option value="">All Specializations</option>
            <option value="conversation">Conversation</option>
            <option value="grammar">Grammar</option>
            <option value="business">Business Japanese</option>
            <option value="culture">Culture</option>
          </select>
          
          <input type="text" id="partnerSearchInput" placeholder="Search partners..." class="search-input" 
                 oninput="adminManager.handleSearch('partners')">
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th onclick="adminManager.sortTable('name')">Name</th>
              <th onclick="adminManager.sortTable('email')">Email</th>
              <th onclick="adminManager.sortTable('specialization')">Specialization</th>
              <th onclick="adminManager.sortTable('experience')">Experience</th>
              <th onclick="adminManager.sortTable('rating')">Rating</th>
              <th onclick="adminManager.sortTable('students')">Students</th>
              <th onclick="adminManager.sortTable('revenue')">Revenue</th>
              <th onclick="adminManager.sortTable('status')">Status</th>
              <th onclick="adminManager.sortTable('joined')">Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="partnersTableBody">
            ${this.renderPartnersTable()}
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        ${this.renderPagination()}
      </div>
    `;
  }

  // Load learners management
  loadLearners() {
    const container = this.getOrCreateSection("learners");
    container.innerHTML = `
      <div class="management-header">
        <div class="header-left">
          <h2>Learners Management</h2>
          <p>Manage student accounts and progress</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" onclick="adminManager.showCreateLearnerModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Add Learner
          </button>
        </div>
      </div>

      <div class="management-filters">
        <div class="filter-group">
          <select id="learnerStatusFilter" class="filter-select" onchange="adminManager.applyFilters('learners')">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select id="learnerLevelFilter" class="filter-select" onchange="adminManager.applyFilters('learners')">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          
          <input type="text" id="learnerSearchInput" placeholder="Search learners..." class="search-input" 
                 oninput="adminManager.handleSearch('learners')">
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th onclick="adminManager.sortTable('name')">Name</th>
              <th onclick="adminManager.sortTable('email')">Email</th>
              <th onclick="adminManager.sortTable('level')">Level</th>
              <th onclick="adminManager.sortTable('courses')">Courses</th>
              <th onclick="adminManager.sortTable('progress')">Progress</th>
              <th onclick="adminManager.sortTable('spent')">Total Spent</th>
              <th onclick="adminManager.sortTable('last_active')">Last Active</th>
              <th onclick="adminManager.sortTable('status')">Status</th>
              <th onclick="adminManager.sortTable('joined')">Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="learnersTableBody">
            ${this.renderLearnersTable()}
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        ${this.renderPagination()}
      </div>
    `;
  }

  // Load orders management
  loadOrders() {
    const container = this.getOrCreateSection("orders");
    container.innerHTML = `
      <div class="management-header">
        <div class="header-left">
          <h2>Orders Management</h2>
          <p>Manage all transactions and payments</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" onclick="adminManager.exportData('orders')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Orders
          </button>
        </div>
      </div>

      <div class="management-filters">
        <div class="filter-group">
          <select id="orderStatusFilter" class="filter-select" onchange="adminManager.applyFilters('orders')">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <select id="orderTypeFilter" class="filter-select" onchange="adminManager.applyFilters('orders')">
            <option value="">All Types</option>
            <option value="course">Course Purchase</option>
            <option value="classroom">Classroom Enrollment</option>
          </select>
          
          <input type="date" id="orderDateFrom" class="date-input" onchange="adminManager.applyFilters('orders')">
          <input type="date" id="orderDateTo" class="date-input" onchange="adminManager.applyFilters('orders')">
          
          <input type="text" id="orderSearchInput" placeholder="Search orders..." class="search-input" 
                 oninput="adminManager.handleSearch('orders')">
        </div>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th onclick="adminManager.sortTable('order_id')">Order ID</th>
              <th onclick="adminManager.sortTable('customer')">Customer</th>
              <th onclick="adminManager.sortTable('item')">Item</th>
              <th onclick="adminManager.sortTable('type')">Type</th>
              <th onclick="adminManager.sortTable('amount')">Amount</th>
              <th onclick="adminManager.sortTable('payment_method')">Payment</th>
              <th onclick="adminManager.sortTable('status')">Status</th>
              <th onclick="adminManager.sortTable('date')">Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="ordersTableBody">
            ${this.renderOrdersTable()}
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        ${this.renderPagination()}
      </div>
    `;
  }

  // Render tables with mock data
  renderCoursesTable() {
    const courses = [
      {
        id: 1,
        title: "Japanese for Beginners",
        teacher: "Hiroshi Tanaka",
        level: "Beginner",
        price: 49.99,
        students: 1205,
        rating: 4.8,
        status: "Published",
        created_at: "2024-01-15",
      },
      {
        id: 2,
        title: "Business Japanese Mastery",
        teacher: "Akiko Sato",
        level: "Advanced",
        price: 89.99,
        students: 567,
        rating: 4.9,
        status: "Published",
        created_at: "2024-02-01",
      },
    ];

    return courses
      .map(
        (course) => `
      <tr>
        <td><strong>${course.title}</strong></td>
        <td>${course.teacher}</td>
        <td><span class="level-badge ${course.level.toLowerCase()}">${course.level}</span></td>
        <td>$${course.price}</td>
        <td>${course.students}</td>
        <td>⭐ ${course.rating}</td>
        <td><span class="status-badge ${course.status.toLowerCase()}">${course.status}</span></td>
        <td>${course.created_at}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="adminManager.editItem('course', ${course.id})" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.viewItem('course', ${course.id})" title="View">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon danger" onclick="adminManager.deleteItem('course', ${course.id})" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  renderClassroomsTable() {
    const classrooms = [
      {
        id: 1,
        title: "Morning Conversation Circle",
        teacher: "Yuki Tanaka",
        level: "Intermediate",
        price: 25.0,
        capacity: 8,
        enrolled: 6,
        status: "Active",
        next_session: "2024-01-20 09:00",
      },
    ];

    return classrooms
      .map(
        (classroom) => `
      <tr>
        <td><strong>${classroom.title}</strong></td>
        <td>${classroom.teacher}</td>
        <td><span class="level-badge ${classroom.level.toLowerCase()}">${classroom.level}</span></td>
        <td>$${classroom.price}</td>
        <td>${classroom.capacity}</td>
        <td>${classroom.enrolled}/${classroom.capacity}</td>
        <td><span class="status-badge ${classroom.status.toLowerCase()}">${classroom.status}</span></td>
        <td>${classroom.next_session}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="adminManager.editItem('classroom', ${classroom.id})" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.viewItem('classroom', ${classroom.id})" title="View">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon danger" onclick="adminManager.deleteItem('classroom', ${classroom.id})" title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  renderPartnersTable() {
    const partners = [
      {
        id: 1,
        name: "Hiroshi Tanaka",
        email: "hiroshi@example.com",
        specialization: "Conversation",
        experience: "5 years",
        rating: 4.8,
        students: 150,
        revenue: "$2,450",
        status: "Active",
        joined: "2023-06-15",
      },
    ];

    return partners
      .map(
        (partner) => `
      <tr>
        <td><strong>${partner.name}</strong></td>
        <td>${partner.email}</td>
        <td>${partner.specialization}</td>
        <td>${partner.experience}</td>
        <td>⭐ ${partner.rating}</td>
        <td>${partner.students}</td>
        <td>${partner.revenue}</td>
        <td><span class="status-badge ${partner.status.toLowerCase()}">${partner.status}</span></td>
        <td>${partner.joined}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="adminManager.editItem('partner', ${partner.id})" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.viewItem('partner', ${partner.id})" title="View">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.toggleStatus('partner', ${partner.id})" title="Toggle Status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  renderLearnersTable() {
    const learners = [
      {
        id: 1,
        name: "Emma Johnson",
        email: "emma@example.com",
        level: "Intermediate",
        courses: 3,
        progress: "65%",
        spent: "$189.97",
        last_active: "2024-01-18",
        status: "Active",
        joined: "2023-11-20",
      },
    ];

    return learners
      .map(
        (learner) => `
      <tr>
        <td><strong>${learner.name}</strong></td>
        <td>${learner.email}</td>
        <td><span class="level-badge ${learner.level.toLowerCase()}">${learner.level}</span></td>
        <td>${learner.courses}</td>
        <td>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${learner.progress}"></div>
            <span class="progress-text">${learner.progress}</span>
          </div>
        </td>
        <td>${learner.spent}</td>
        <td>${learner.last_active}</td>
        <td><span class="status-badge ${learner.status.toLowerCase()}">${learner.status}</span></td>
        <td>${learner.joined}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="adminManager.editItem('learner', ${learner.id})" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.viewItem('learner', ${learner.id})" title="View Progress">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.toggleStatus('learner', ${learner.id})" title="Toggle Status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  renderOrdersTable() {
    const orders = [
      {
        id: "ORD-2024-001",
        customer: "Emma Johnson",
        item: "Japanese for Beginners",
        type: "Course",
        amount: "$49.99",
        payment_method: "Credit Card",
        status: "Completed",
        date: "2024-01-18 14:30",
      },
    ];

    return orders
      .map(
        (order) => `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${order.customer}</td>
        <td>${order.item}</td>
        <td><span class="type-badge ${order.type.toLowerCase()}">${order.type}</span></td>
        <td>${order.amount}</td>
        <td>${order.payment_method}</td>
        <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
        <td>${order.date}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="adminManager.viewItem('order', '${order.id}')" title="View Details">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.printInvoice('${order.id}')" title="Print Invoice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 6,2 18,2 18,9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
            </button>
            <button class="btn-icon" onclick="adminManager.refundOrder('${order.id}')" title="Process Refund">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1,4 1,10 7,10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  // Utility methods
  renderPagination() {
    const totalPages = 5; // Mock total pages
    return `
      <div class="pagination">
        <button class="btn btn-outline" ${this.currentPage === 1 ? "disabled" : ""} 
                onclick="adminManager.changePage(${this.currentPage - 1})">Previous</button>
        
        <div class="page-numbers">
          ${Array.from({ length: totalPages }, (_, i) => i + 1)
            .map(
              (page) => `
            <button class="page-btn ${page === this.currentPage ? "active" : ""}" 
                    onclick="adminManager.changePage(${page})">${page}</button>
          `,
            )
            .join("")}
        </div>
        
        <button class="btn btn-outline" ${this.currentPage === totalPages ? "disabled" : ""} 
                onclick="adminManager.changePage(${this.currentPage + 1})">Next</button>
      </div>
    `;
  }

  getOrCreateSection(sectionName) {
    let section = document.getElementById(`${sectionName}Section`);
    if (!section) {
      section = document.createElement("div");
      section.id = `${sectionName}Section`;
      section.className = "management-section";
      document.querySelector(".admin-content").appendChild(section);
    }
    section.style.display = "block";
    return section;
  }

  // Event handlers
  changePage(page) {
    this.currentPage = page;
    this.loadSection(this.currentSection);
  }

  sortTable(column) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    } else {
      this.sortBy = column;
      this.sortOrder = "asc";
    }
    this.loadSection(this.currentSection);
  }

  handleSearch(section) {
    const input = document.getElementById(`${section}SearchInput`);
    this.searchQuery = input.value;
    this.currentPage = 1;
    this.loadSection(this.currentSection);
  }

  applyFilters(section) {
    this.currentPage = 1;
    this.loadSection(this.currentSection);
  }

  clearFilters(section) {
    const filters = document.querySelectorAll(
      `#${section}StatusFilter, #${section}LevelFilter, #${section}SearchInput`,
    );
    filters.forEach((filter) => (filter.value = ""));
    this.searchQuery = "";
    this.filters = {};
    this.loadSection(this.currentSection);
  }

  exportData(section) {
    const csvData = `Name,Status,Date\nSample Data,Active,2024-01-01`;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${section}-export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // CRUD Operations
  editItem(type, id) {
    alert(`Edit ${type} with ID: ${id}`);
  }

  viewItem(type, id) {
    alert(`View ${type} with ID: ${id}`);
  }

  deleteItem(type, id) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      alert(`Deleted ${type} with ID: ${id}`);
      this.loadSection(this.currentSection);
    }
  }

  toggleStatus(type, id) {
    alert(`Toggle status for ${type} with ID: ${id}`);
    this.loadSection(this.currentSection);
  }

  // Modal methods
  showCreateCourseModal() {
    alert("Create Course modal would open here");
  }

  showCreateClassroomModal() {
    alert("Create Classroom modal would open here");
  }

  showInvitePartnerModal() {
    alert("Invite Partner modal would open here");
  }

  showCreateLearnerModal() {
    alert("Create Learner modal would open here");
  }

  printInvoice(orderId) {
    alert(`Print invoice for order: ${orderId}`);
  }

  refundOrder(orderId) {
    if (
      confirm(`Are you sure you want to process a refund for order ${orderId}?`)
    ) {
      alert(`Refund processed for order: ${orderId}`);
    }
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Global function to load sections (for onclick handlers)
function loadSection(section) {
  if (window.adminManager) {
    window.adminManager.loadSection(section);
  }
}

// Initialize admin management system
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".admin-layout")) {
    window.adminManager = new AdminManagement();
  }
});
