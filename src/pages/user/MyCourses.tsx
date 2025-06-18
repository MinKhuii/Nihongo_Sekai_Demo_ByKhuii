import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Star, Play, CheckCircle } from "lucide-react";

export default function MyCourses() {
  const enrolledCourses = [
    {
      id: "1",
      title: "Japanese for Beginners: Hiragana & Katakana",
      instructor: "Yuki Tanaka",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      rating: 4.7,
      thumbnail:
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop",
      lastAccessed: "2 hours ago",
      status: "in-progress",
    },
    {
      id: "2",
      title: "Conversational Japanese: Daily Life",
      instructor: "Yuki Tanaka",
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      rating: 4.8,
      thumbnail:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop",
      lastAccessed: "1 day ago",
      status: "in-progress",
    },
    {
      id: "3",
      title: "JLPT N5 Preparation Course",
      instructor: "Hiroshi Sato",
      progress: 100,
      totalLessons: 20,
      completedLessons: 20,
      rating: 4.6,
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      lastAccessed: "1 week ago",
      status: "completed",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-nihongo-ink-900 mb-2">
                My Courses
              </h1>
              <p className="text-nihongo-ink-600">
                Track your progress and continue learning
              </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-nihongo-ink-600">
                        Enrolled Courses
                      </p>
                      <p className="text-2xl font-bold text-nihongo-ink-900">
                        {enrolledCourses.length}
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
                      <p className="text-sm text-nihongo-ink-600">Completed</p>
                      <p className="text-2xl font-bold text-nihongo-ink-900">
                        {
                          enrolledCourses.filter(
                            (c) => c.status === "completed",
                          ).length
                        }
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-nihongo-ink-600">
                        Avg Progress
                      </p>
                      <p className="text-2xl font-bold text-nihongo-ink-900">
                        {Math.round(
                          enrolledCourses.reduce(
                            (sum, c) => sum + c.progress,
                            0,
                          ) / enrolledCourses.length,
                        )}
                        %
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      {course.status === "completed" ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-nihongo-ink-600">
                      by {course.instructor}
                    </p>
                  </CardHeader>

                  <CardContent>
                    {/* Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-nihongo-ink-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-nihongo-ink-500">
                        {course.completedLessons} of {course.totalLessons}{" "}
                        lessons completed
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-nihongo-ink-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.lastAccessed}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-gradient-crimson hover:opacity-90 text-white"
                      disabled={course.status === "completed"}
                    >
                      {course.status === "completed" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review Course
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
