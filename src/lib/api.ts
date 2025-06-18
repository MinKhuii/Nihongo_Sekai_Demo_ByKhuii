import {
  Course,
  Classroom,
  Partner,
  ApiResponse,
  PaginatedResponse,
  CourseSearchParams,
  ClassroomSearchParams,
} from "@/types";
import { mockCourses, mockClassrooms, mockPartners } from "@/data/mockData";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Base API URL - will be replaced with actual .NET backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Mock API service that simulates the .NET backend
export class ApiService {
  // Course endpoints
  static async getCourses(
    params?: CourseSearchParams,
  ): Promise<PaginatedResponse<Course>> {
    await delay(500);

    let filteredCourses = [...mockCourses];

    // Apply filters
    if (params?.query) {
      const query = params.query.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query),
      );
    }

    if (params?.level) {
      filteredCourses = filteredCourses.filter(
        (course) => course.level === params.level,
      );
    }

    if (params?.minPrice !== undefined) {
      filteredCourses = filteredCourses.filter(
        (course) => course.tuition >= params.minPrice!,
      );
    }

    if (params?.maxPrice !== undefined) {
      filteredCourses = filteredCourses.filter(
        (course) => course.tuition <= params.maxPrice!,
      );
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredCourses.sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (params.sortBy) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "price":
            aValue = a.tuition;
            bValue = b.tuition;
            break;
          case "rating":
            aValue = a.evaluationPoint;
            bValue = b.evaluationPoint;
            break;
          case "students":
            aValue = a.studentsCount;
            bValue = b.studentsCount;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return params.sortOrder === "desc"
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        return params.sortOrder === "desc"
          ? (bValue as number) - (aValue as number)
          : (aValue as number) - (bValue as number);
      });
    }

    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return {
      data: paginatedCourses,
      totalCount: filteredCourses.length,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(filteredCourses.length / pageSize),
    };
  }

  static async getCourse(id: string): Promise<ApiResponse<Course>> {
    await delay(300);

    const course = mockCourses.find((c) => c.courseId === id);

    if (!course) {
      return {
        success: false,
        data: {} as Course,
        message: "Course not found",
      };
    }

    return {
      success: true,
      data: course,
    };
  }

  static async getFeaturedCourses(): Promise<ApiResponse<Course[]>> {
    await delay(200);

    const featured = mockCourses
      .filter((course) => course.evaluationPoint >= 4.5)
      .sort((a, b) => b.evaluationPoint - a.evaluationPoint)
      .slice(0, 6);

    return {
      success: true,
      data: featured,
    };
  }

  // Classroom endpoints
  static async getClassrooms(
    params?: ClassroomSearchParams,
  ): Promise<PaginatedResponse<Classroom>> {
    await delay(400);

    let filteredClassrooms = [...mockClassrooms];

    if (params?.query) {
      const query = params.query.toLowerCase();
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) =>
          classroom.title.toLowerCase().includes(query) ||
          classroom.description.toLowerCase().includes(query),
      );
    }

    if (params?.partnerId) {
      filteredClassrooms = filteredClassrooms.filter(
        (classroom) => classroom.partnerId === params.partnerId,
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedClassrooms = filteredClassrooms.slice(startIndex, endIndex);

    return {
      data: paginatedClassrooms,
      totalCount: filteredClassrooms.length,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(filteredClassrooms.length / pageSize),
    };
  }

  static async getClassroom(id: string): Promise<ApiResponse<Classroom>> {
    await delay(300);

    const classroom = mockClassrooms.find((c) => c.classroomId === id);

    if (!classroom) {
      return {
        success: false,
        data: {} as Classroom,
        message: "Classroom not found",
      };
    }

    return {
      success: true,
      data: classroom,
    };
  }

  // Partner endpoints
  static async getPartners(): Promise<ApiResponse<Partner[]>> {
    await delay(300);

    return {
      success: true,
      data: mockPartners,
    };
  }

  static async getPartner(id: string): Promise<ApiResponse<Partner>> {
    await delay(300);

    const partner = mockPartners.find((p) => p.partnerId === id);

    if (!partner) {
      return {
        success: false,
        data: {} as Partner,
        message: "Partner not found",
      };
    }

    return {
      success: true,
      data: partner,
    };
  }
}

// Helper functions for real API integration
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers when available
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
};

// Authentication helper (to be implemented)
// const getAuthToken = (): string | null => {
//   return localStorage.getItem('authToken');
// };
