// Admin dashboard types
export interface AdminKPIs {
  totalUsers: number;
  totalCourses: number;
  pendingTeacherApps: number;
  monthlyRevenue: number;
}

export interface AdminCourse {
  id: string;
  title: string;
  status: "active" | "draft" | "archived";
  instructor: string;
  studentsCount: number;
  createdAt: string;
  revenue: number;
}

export interface PendingTeacherApplication {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
  experience: number;
  specializations: string[];
  status: "pending" | "approved" | "rejected";
  documents: string[];
}

export interface SignupTrend {
  date: string;
  count: number;
}

export interface SalesTrend {
  date: string;
  revenue: number;
}

export interface AdminAnalytics {
  signupTrend: SignupTrend[];
  salesTrend: SalesTrend[];
  totalRevenue: number;
  totalSignups: number;
  conversionRate: number;
  averageOrderValue: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  level: "Beginner" | "Elementary" | "Intermediate" | "Advanced";
  price: number;
  instructor: string;
  thumbnail?: string;
}
