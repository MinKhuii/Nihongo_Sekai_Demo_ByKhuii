import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Partner } from "@/types";
import {
  Star,
  GraduationCap,
  Users,
  MessageCircle,
  CheckCircle,
  Award,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeacherCardProps {
  teacher: Partner;
  variant?: "grid" | "list";
}

export function TeacherCard({ teacher, variant = "grid" }: TeacherCardProps) {
  const totalStudents = teacher.coursesTaught.reduce(
    (sum, course) => sum + course.studentsCount,
    0,
  );

  if (variant === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-48 md:h-auto p-6 flex items-center justify-center bg-gradient-to-br from-nihongo-crimson-50 to-nihongo-sakura-50">
            <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
              <AvatarImage src={teacher.avatarUrl} />
              <AvatarFallback className="bg-gradient-crimson text-white text-2xl">
                {teacher.account?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-heading font-semibold text-nihongo-ink-900">
                    {teacher.account?.name}
                  </h3>
                  {teacher.isApproved && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <p className="text-nihongo-ink-600 text-sm mb-4 line-clamp-2">
                  {teacher.shortBio}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {teacher.specializations.slice(0, 3).map((spec) => (
                    <Badge
                      key={spec}
                      variant="outline"
                      className="text-xs bg-nihongo-ink-50"
                    >
                      {spec}
                    </Badge>
                  ))}
                  {teacher.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.specializations.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-6 text-sm text-nihongo-ink-500">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{teacher.averageRating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{teacher.teachingExperience}+ years</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{totalStudents.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{teacher.coursesTaught.length} courses</span>
                  </div>
                </div>
              </div>

              <div className="text-right ml-6">
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link to={`/teachers/${teacher.partnerId}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
            <AvatarImage src={teacher.avatarUrl} />
            <AvatarFallback className="bg-gradient-crimson text-white text-xl">
              {teacher.account?.name?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
          {teacher.isApproved && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-heading font-semibold text-nihongo-ink-900 group-hover:text-nihongo-crimson-600 transition-colors">
          {teacher.account?.name}
        </h3>

        <div className="flex items-center justify-center space-x-4 text-sm text-nihongo-ink-500 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium">{teacher.averageRating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GraduationCap className="h-4 w-4" />
            <span>{teacher.teachingExperience}+ years</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-nihongo-ink-600 text-sm line-clamp-2 mb-4">
          {teacher.shortBio}
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1 mb-4">
          {teacher.specializations.slice(0, 2).map((spec) => (
            <Badge
              key={spec}
              variant="outline"
              className="text-xs bg-nihongo-ink-50"
            >
              {spec}
            </Badge>
          ))}
          {teacher.specializations.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{teacher.specializations.length - 2}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-bold text-nihongo-crimson-600">
              {totalStudents.toLocaleString()}
            </div>
            <div className="text-xs text-nihongo-ink-500">Students</div>
          </div>
          <div>
            <div className="text-lg font-bold text-nihongo-crimson-600">
              {teacher.coursesTaught.length}
            </div>
            <div className="text-xs text-nihongo-ink-500">Courses</div>
          </div>
        </div>

        {/* Certifications Indicator */}
        {teacher.certifications.length > 0 && (
          <div className="flex items-center justify-center space-x-1 text-xs text-nihongo-gold-600 mb-4">
            <Award className="h-3 w-3" />
            <span>{teacher.certifications.length} Certifications</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            asChild
            className="w-full bg-gradient-crimson hover:opacity-90 text-white shadow-md"
          >
            <Link to={`/teachers/${teacher.partnerId}`}>View Profile</Link>
          </Button>
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
