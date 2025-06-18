import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiService } from "@/lib/api";
import { Course } from "@/types";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Play,
  ArrowLeft,
  CheckCircle,
  Award,
  Target,
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        setError("Course ID not provided");
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.getCourse(id);
        if (response.success) {
          setCourse(response.data);
        } else {
          setError(response.message || "Course not found");
        }
      } catch (err) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-nihongo">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
              </div>
              <div>
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-nihongo">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nihongo-ink-100">
                <BookOpen className="h-8 w-8 text-nihongo-ink-400" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-nihongo-ink-900 mb-4">
                Course Not Found
              </h1>
              <p className="text-nihongo-ink-600 mb-8">
                {error || "The course you're looking for doesn't exist."}
              </p>
              <Button asChild>
                <Link to="/courses">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Courses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Elementary: "bg-blue-100 text-blue-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                to="/courses"
                className="text-nihongo-ink-600 hover:text-nihongo-crimson-600 flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                All Courses
              </Link>
              <span className="text-nihongo-ink-400">/</span>
              <span className="text-nihongo-ink-900">{course.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className={levelColors[course.level]}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900 mb-4">
                  {course.name}
                </h1>

                <p className="text-lg text-nihongo-ink-600 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">
                      {course.evaluationPoint}
                    </span>
                    <span className="text-nihongo-ink-500">rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-5 w-5 text-nihongo-ink-500" />
                    <span>
                      {course.studentsCount.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-5 w-5 text-nihongo-ink-500" />
                    <span>Certificate included</span>
                  </div>
                </div>
              </div>

              {/* Course Image */}
              <div className="mb-8">
                <img
                  src={course.coverImageUrl}
                  alt={course.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Learning Outcomes */}
              {course.outcomes.length > 0 && (
                <Card className="mb-8 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-nihongo-crimson-600" />
                      <span>What You'll Learn</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.outcomes.map((outcome) => (
                        <div
                          key={outcome.outcomeId}
                          className="flex items-start space-x-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-nihongo-ink-700">
                            {outcome.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Course Curriculum */}
              {course.lessons.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-nihongo-crimson-600" />
                      <span>Course Curriculum</span>
                    </CardTitle>
                    <p className="text-nihongo-ink-600">
                      {course.lessons.length} lessons •{" "}
                      {course.lessons.reduce(
                        (total, lesson) => total + lesson.duration,
                        0,
                      )}{" "}
                      minutes total
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.lessons.map((lesson, index) => (
                        <div
                          key={lesson.lessonId}
                          className="flex items-center justify-between p-4 bg-nihongo-ink-50 rounded-lg hover:bg-nihongo-ink-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-nihongo-crimson-100 text-nihongo-crimson-700 rounded-full text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-nihongo-ink-900">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-nihongo-ink-500">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration} minutes</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card className="border-0 shadow-lg sticky top-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-nihongo-crimson-600 mb-2">
                      ${course.tuition}
                    </div>
                    <p className="text-nihongo-ink-600">Full course access</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Level</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Duration</span>
                      <span className="font-medium">
                        {course.duration} hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Lessons</span>
                      <span className="font-medium">
                        {course.lessons.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Students</span>
                      <span className="font-medium">
                        {course.studentsCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {course.evaluationPoint}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-crimson hover:opacity-90 text-white shadow-lg">
                      Enroll Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      Add to Wishlist
                    </Button>
                  </div>

                  <div className="text-center mt-6 text-sm text-nihongo-ink-500">
                    <p>30-day money-back guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
