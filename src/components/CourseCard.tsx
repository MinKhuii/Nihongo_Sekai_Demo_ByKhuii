import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
  variant?: "grid" | "list";
}

export function CourseCard({
  course,
  showProgress = false,
  progress = 0,
  variant = "grid",
}: CourseCardProps) {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Elementary: "bg-blue-100 text-blue-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  if (variant === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto">
            <img
              src={course.coverImageUrl}
              alt={course.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={levelColors[course.level]}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}h</span>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold text-nihongo-ink-900 mb-2 line-clamp-2">
                  {course.name}
                </h3>
                <p className="text-nihongo-ink-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-nihongo-ink-500">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {course.evaluationPoint}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {course.studentsCount.toLocaleString()} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-nihongo-crimson-600 mb-2">
                  ${course.tuition}
                </div>
                <Button
                  asChild
                  className="bg-gradient-crimson hover:opacity-90 text-white"
                >
                  <Link to={`/courses/${course.courseId}`}>View Course</Link>
                </Button>
              </div>
            </div>
            {showProgress && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-nihongo-ink-600">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-nihongo-ink-200 rounded-full h-2">
                  <div
                    className="bg-gradient-crimson h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <div className="relative">
        <img
          src={course.coverImageUrl}
          alt={course.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={levelColors[course.level]}>{course.level}</Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1 text-sm">
            <Clock className="h-3 w-3 text-nihongo-ink-500" />
            <span className="text-nihongo-ink-700 font-medium">
              {course.duration}h
            </span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-heading font-semibold text-nihongo-ink-900 line-clamp-2 group-hover:text-nihongo-crimson-600 transition-colors">
          {course.name}
        </h3>
        <p className="text-nihongo-ink-600 text-sm line-clamp-2">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-sm text-nihongo-ink-500">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{course.evaluationPoint}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-nihongo-ink-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-nihongo-ink-200 rounded-full h-2">
              <div
                className="bg-gradient-crimson h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-nihongo-crimson-600">
            ${course.tuition}
          </div>
          <Button
            asChild
            className="bg-gradient-crimson hover:opacity-90 text-white shadow-md"
          >
            <Link to={`/courses/${course.courseId}`}>View Course</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
