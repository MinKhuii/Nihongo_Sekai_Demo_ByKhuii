import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { TeacherCard } from "@/components/TeacherCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiService } from "@/lib/api";
import { Partner } from "@/types";
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  GraduationCap,
  Star,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeacherSearchParams {
  query?: string;
  specialization?: string;
  experience?: string;
  rating?: string;
  page?: number;
  pageSize?: number;
}

export default function Teachers() {
  const [teachers, setTeachers] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<TeacherSearchParams>({
    page: 1,
    pageSize: 12,
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadTeachers = async (params: TeacherSearchParams) => {
    setLoading(true);
    try {
      const response = await ApiService.getPartners();
      if (response.success) {
        let filteredTeachers = response.data;

        // Apply search filter
        if (params.query) {
          const query = params.query.toLowerCase();
          filteredTeachers = filteredTeachers.filter(
            (teacher) =>
              teacher.account?.name.toLowerCase().includes(query) ||
              teacher.shortBio.toLowerCase().includes(query) ||
              teacher.specializations.some((spec) =>
                spec.toLowerCase().includes(query),
              ),
          );
        }

        // Apply specialization filter
        if (params.specialization) {
          filteredTeachers = filteredTeachers.filter((teacher) =>
            teacher.specializations.includes(params.specialization!),
          );
        }

        // Apply experience filter
        if (params.experience) {
          const minExp = parseInt(params.experience);
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.teachingExperience >= minExp,
          );
        }

        // Apply rating filter
        if (params.rating) {
          const minRating = parseFloat(params.rating);
          filteredTeachers = filteredTeachers.filter(
            (teacher) => teacher.averageRating >= minRating,
          );
        }

        // Apply pagination
        const startIndex = ((params.page || 1) - 1) * (params.pageSize || 12);
        const endIndex = startIndex + (params.pageSize || 12);
        const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

        setTeachers(paginatedTeachers);
        setTotalCount(filteredTeachers.length);
        setCurrentPage(params.page || 1);
      }
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers(searchParams);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchParams({ ...searchParams, query, page: 1 });
  };

  const handleFilterChange = (filters: Partial<TeacherSearchParams>) => {
    setSearchParams({ ...searchParams, ...filters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const totalPages = Math.ceil(totalCount / (searchParams.pageSize || 12));

  const specializations = [
    "Conversational Japanese",
    "Business Japanese",
    "JLPT Preparation",
    "Cultural Japanese",
    "Anime & Manga",
    "Grammar",
    "Traditional Arts",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Header Section */}
        <section className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-nihongo-gold-100 text-nihongo-gold-800">
                <GraduationCap className="h-3 w-3 mr-1" />
                Expert Instructors
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900 mb-4">
                Learn from Certified Japanese Teachers
              </h1>
              <p className="text-lg text-nihongo-ink-600 max-w-2xl mx-auto">
                Connect with experienced native speakers and certified
                instructors who bring years of teaching experience and cultural
                knowledge to help you master Japanese.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                  <Input
                    placeholder="Search teachers, specializations, or topics..."
                    className="pl-10 pr-4 py-6 text-base"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:px-6 py-6"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Quick Filter Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {specializations.slice(0, 5).map((spec) => (
                  <Badge
                    key={spec}
                    variant="outline"
                    className="cursor-pointer hover:bg-nihongo-crimson-50 hover:border-nihongo-crimson-200"
                    onClick={() => handleFilterChange({ specialization: spec })}
                  >
                    {spec}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-nihongo-gold-50 hover:border-nihongo-gold-200"
                  onClick={() => handleFilterChange({ rating: "4.5" })}
                >
                  ⭐ 4.5+ Rating
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-nihongo-sakura-50 hover:border-nihongo-sakura-200"
                  onClick={() => handleFilterChange({ experience: "5" })}
                >
                  5+ Years Experience
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters */}
        {showFilters && (
          <section className="bg-white/60 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  onValueChange={(value) =>
                    handleFilterChange({ specialization: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    handleFilterChange({ experience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Experience</SelectItem>
                    <SelectItem value="1">1+ Years</SelectItem>
                    <SelectItem value="3">3+ Years</SelectItem>
                    <SelectItem value="5">5+ Years</SelectItem>
                    <SelectItem value="8">8+ Years</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    handleFilterChange({ rating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                    <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                    <SelectItem value="4.8">4.8+ ⭐</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setSearchParams({ page: 1, pageSize: 12 })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-nihongo-ink-600">
                  Showing {teachers.length} of {totalCount} teachers
                  {searchParams.query && (
                    <span> for "{searchParams.query}"</span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select>
                  <SelectTrigger className="w-48">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="students">Most Students</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "rounded-r-none",
                      viewMode === "grid" &&
                        "bg-nihongo-crimson-50 text-nihongo-crimson-600",
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "rounded-l-none border-l",
                      viewMode === "list" &&
                        "bg-nihongo-crimson-50 text-nihongo-crimson-600",
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Teachers Grid/List */}
            {loading ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : teachers.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {teachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.partnerId}
                    teacher={teacher}
                    variant={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nihongo-ink-100">
                  <GraduationCap className="h-8 w-8 text-nihongo-ink-400" />
                </div>
                <h3 className="text-lg font-semibold text-nihongo-ink-900 mb-2">
                  No teachers found
                </h3>
                <p className="text-nihongo-ink-600 mb-4">
                  Try adjusting your search criteria or browse all available
                  teachers.
                </p>
                <Button
                  onClick={() => setSearchParams({ page: 1, pageSize: 12 })}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        page === currentPage &&
                          "bg-nihongo-crimson-600 hover:bg-nihongo-crimson-700",
                      )}
                    >
                      {page}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-nihongo-crimson-600 mb-2">
                  80+
                </div>
                <p className="text-nihongo-ink-600">Certified Teachers</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nihongo-crimson-600 mb-2">
                  4.8
                </div>
                <p className="text-nihongo-ink-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nihongo-crimson-600 mb-2">
                  25,000+
                </div>
                <p className="text-nihongo-ink-600">Students Taught</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-nihongo-crimson-600 mb-2">
                  94%
                </div>
                <p className="text-nihongo-ink-600">Success Rate</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
