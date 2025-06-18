import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminCourse, CreateCourseData } from "@/types/admin";
import { mockAdminCourses } from "@/data/adminMockData";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Filter,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setCourses(mockAdminCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCourse = async (data: CreateCourseData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCourse: AdminCourse = {
        id: Date.now().toString(),
        title: data.title,
        status: "draft",
        instructor: data.instructor,
        studentsCount: 0,
        createdAt: new Date().toISOString(),
        revenue: 0,
      };

      setCourses([newCourse, ...courses]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      setCourses(
        courses.map((course) =>
          course.id === courseId
            ? { ...course, status: newStatus as any }
            : course,
        ),
      );
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const CreateCourseModal = () => {
    const [formData, setFormData] = useState<CreateCourseData>({
      title: "",
      description: "",
      level: "Beginner",
      price: 0,
      instructor: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      await handleCreateCourse(formData);
      setIsSubmitting(false);
      setFormData({
        title: "",
        description: "",
        level: "Beginner",
        price: 0,
        instructor: "",
      });
    };

    return (
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Select
                  value={formData.instructor}
                  onValueChange={(value) =>
                    setFormData({ ...formData, instructor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yuki Tanaka">Yuki Tanaka</SelectItem>
                    <SelectItem value="Hiroshi Sato">Hiroshi Sato</SelectItem>
                    <SelectItem value="Akiko Yamamoto">
                      Akiko Yamamoto
                    </SelectItem>
                    <SelectItem value="Takeshi Morimoto">
                      Takeshi Morimoto
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter course description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-crimson hover:opacity-90 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-nihongo-ink-900">
                  Course Management
                </h1>
                <p className="text-nihongo-ink-600 mt-2">
                  Manage all courses on the platform
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-crimson hover:opacity-90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">
                      Total Courses
                    </p>
                    <p className="text-2xl font-bold text-nihongo-ink-900">
                      {courses.length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-nihongo-crimson-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">
                      Active Courses
                    </p>
                    <p className="text-2xl font-bold text-nihongo-ink-900">
                      {courses.filter((c) => c.status === "active").length}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-nihongo-ink-900">
                      {courses
                        .reduce((sum, course) => sum + course.studentsCount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nihongo-ink-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-nihongo-ink-900">
                      $
                      {courses
                        .reduce((sum, course) => sum + course.revenue, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Courses Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                          <TableCell>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredCourses.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-nihongo-ink-500"
                        >
                          No courses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-nihongo-ink-900">
                                {course.title}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{course.instructor}</TableCell>
                          <TableCell>
                            <Select
                              value={course.status}
                              onValueChange={(value) =>
                                handleStatusChange(course.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <Badge
                                  className={cn(
                                    getStatusColor(course.status),
                                    "capitalize",
                                  )}
                                >
                                  {course.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {course.studentsCount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${course.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {format(parseISO(course.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingCourse(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Course
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {course.title}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCourse(course.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <CreateCourseModal />
      </div>
    </Layout>
  );
}
