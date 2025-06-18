// Core domain types matching the .NET backend models

export interface Account {
  accountId: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: "Learner" | "Partner" | "Admin";
  status: "Active" | "Inactive" | "Pending";
  createdAt: string;
}

export interface Learner {
  learnerId: string;
  accountId: string;
  level: "Beginner" | "Elementary" | "Intermediate" | "Advanced" | "Native";
  interests: string[];
  account?: Account;
}

export interface Partner {
  partnerId: string;
  accountId: string;
  bio: string;
  shortBio: string;
  teachingExperience: number;
  averageRating: number;
  isApproved: boolean;
  avatarUrl?: string;
  specializations: string[];
  languages: string[];
  certifications: Certification[];
  coursesTaught: TeacherCourse[];
  classroomsHosted: TeacherClassroom[];
  account?: Account;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
}

export interface TeacherCourse {
  id: string;
  title: string;
  level: string;
  studentsCount: number;
  rating: number;
}

export interface TeacherClassroom {
  id: string;
  title: string;
  studentsCount: number;
  schedule: string;
  isActive: boolean;
}

export interface Course {
  courseId: string;
  name: string;
  description: string;
  coverImageUrl: string;
  tuition: number;
  evaluationPoint: number;
  createdBy: string;
  isApproved: boolean;
  level: "Beginner" | "Elementary" | "Intermediate" | "Advanced";
  duration: number; // in hours
  studentsCount: number;
  lessons: Lesson[];
  outcomes: CourseLearningOutcome[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseLearningOutcome {
  outcomeId: string;
  courseId: string;
  description: string;
}

export interface Lesson {
  lessonId: string;
  courseId: string;
  title: string;
  order: number;
  contentUrl: string;
  duration: number; // in minutes
  isCompleted?: boolean;
}

export interface Classroom {
  classroomId: string;
  partnerId: string;
  title: string;
  description: string;
  videoCallLink: string;
  maxStudents: number;
  currentStudents: number;
  schedule: string;
  thumbnail: string;
  partner?: Partner;
  enrollments: ClassroomEnrollment[];
  createdAt: string;
  scheduleEntries: ScheduleEntry[];
  feedPosts: FeedPost[];
}

export interface ScheduleEntry {
  id: string;
  classroomId: string;
  start: string;
  end: string;
  joinUrl: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  topic?: string;
}

export interface FeedPost {
  id: string;
  classroomId: string;
  authorName: string;
  authorRole: "teacher" | "student";
  authorAvatar?: string;
  content: string;
  attachments: FeedAttachment[];
  createdAt: string;
  isAnnouncement?: boolean;
  isAssignment?: boolean;
  dueDate?: string;
}

export interface FeedAttachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image" | "video" | "audio" | "document";
  size: number;
}

export interface ClassroomEnrollment {
  learnerId: string;
  classroomId: string;
  enrollTime: string;
}

export interface Order {
  orderId: string;
  learnerId: string;
  orderDate: string;
  paymentStatus: "Pending" | "Completed" | "Failed" | "Cancelled";
  totalAmount: number;
  transactionId?: string;
  items: OrderItem[];
}

export interface OrderItem {
  orderId: string;
  courseId: string;
  price: number;
  course?: Course;
}

export interface PurchasedCourse {
  learnerId: string;
  courseId: string;
  purchasedDate: string;
  progress: number; // 0-100
  completedLessons: string[];
}

export interface VideoSession {
  sessionId: string;
  classroomId: string;
  startTime: string;
  endTime: string;
  status: "Scheduled" | "Live" | "Completed" | "Cancelled";
}

export interface ChatMessage {
  messageId: string;
  classroomId: string;
  senderId: string;
  content: string;
  timestamp: string;
  senderName?: string;
}

export interface PartnerDocument {
  documentId: string;
  partnerId: string;
  documentType: "Certificate" | "Resume" | "Photo" | "Other";
  filePath: string;
  uploadedAt: string;
}

export interface OtpEntry {
  email: string;
  code: string;
  expiryTime: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Search and filter types
export interface CourseSearchParams {
  query?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: "name" | "price" | "rating" | "students";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ClassroomSearchParams {
  query?: string;
  language?: string;
  schedule?: string;
  partnerId?: string;
  page?: number;
  pageSize?: number;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "Learner" | "Partner";
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: Account;
  expiresIn: number;
}

// UI-specific types
export interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
}

export interface ClassroomCardProps {
  classroom: Classroom;
  showEnrollButton?: boolean;
}

export interface UserProfile {
  account: Account;
  learnerProfile?: Learner;
  partnerProfile?: Partner;
  enrolledCourses?: Course[];
  purchasedCourses?: PurchasedCourse[];
  enrolledClassrooms?: Classroom[];
}
