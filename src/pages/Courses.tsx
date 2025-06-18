import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CourseCard } from "@/components/CourseCard";
import { CourseFilters } from "@/components/CourseFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiService } from "@/lib/api";
import { Course, CourseSearchParams } from "@/types";
import { Search, Filter, Grid, List, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<CourseSearchParams>({
    page: 1,
    pageSize: 12,
    sortBy: "name",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const loadCourses = async (params: CourseSearchParams) => {
    setLoading(true);
    try {
      const response = await ApiService.getCourses(params);
      setCourses(response.data);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses(searchParams);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchParams({ ...searchParams, query, page: 1 });
  };

  const handleFilterChange = (filters: Partial<CourseSearchParams>) => {
    setSearchParams({ ...searchParams, ...filters, page: 1 });
  };

  const handleSortChange = (sortBy: string) => {
    const [field, order] = sortBy.split("-");
    setSearchParams({
      ...searchParams,
      sortBy: field as any,
      sortOrder: order as "asc" | "desc",
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const totalPages = Math.ceil(totalCount / (searchParams.pageSize || 12));

  const levels = ["Beginner", "Elementary", "Intermediate", "Advanced"];
  const categories = ["JLPT", "Business", "Conversation", "Culture", "Grammar"];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Header Section */}
        <section className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900 mb-4">
                Explore Japanese Courses
              </h1>
              <p className="text-lg text-nihongo-ink-600 max-w-2xl mx-auto">
                Discover comprehensive courses designed to help you master
                Japanese language and culture at your own pace.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                  <Input
                    placeholder="Search courses, topics, or skills..."
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
                {levels.map((level) => (
                  <Badge
                    key={level}
                    variant="outline"
                    className="cursor-pointer hover:bg-nihongo-crimson-50 hover:border-nihongo-crimson-200"
                    onClick={() => handleFilterChange({ level })}
                  >
                    {level}
                  </Badge>
                ))}
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-nihongo-sakura-50 hover:border-nihongo-sakura-200"
                    onClick={() => handleFilterChange({ category })}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filters */}
        {showFilters && (
          <section className="bg-white/60 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <CourseFilters
                onFilterChange={handleFilterChange}
                initialFilters={searchParams}
              />
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
                  Showing {courses.length} of {totalCount} courses
                  {searchParams.query && (
                    <span> for "{searchParams.query}"</span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="price-asc">Price Low to High</SelectItem>
                    <SelectItem value="price-desc">
                      Price High to Low
                    </SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    <SelectItem value="students-desc">Most Popular</SelectItem>
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

            {/* Course Grid/List */}
            {loading ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1",
                )}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1",
                )}
              >
                {courses.map((course) => (
                  <CourseCard
                    key={course.courseId}
                    course={course}
                    variant={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nihongo-ink-100">
                  <Search className="h-8 w-8 text-nihongo-ink-400" />
                </div>
                <h3 className="text-lg font-semibold text-nihongo-ink-900 mb-2">
                  No courses found
                </h3>
                <p className="text-nihongo-ink-600 mb-4">
                  Try adjusting your search criteria or browse our featured
                  courses.
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
      </div>
    </Layout>
  );
}
