import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Classroom } from "@/types";
import {
  Users,
  Star,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
} from "lucide-react";

interface ClassroomCardProps {
  classroom: Classroom;
  showEnrollButton?: boolean;
  variant?: "grid" | "list";
}

export function ClassroomCard({
  classroom,
  showEnrollButton = false,
  variant = "grid",
}: ClassroomCardProps) {
  const isNearlyFull = classroom.currentStudents / classroom.maxStudents > 0.8;
  const spotsLeft = classroom.maxStudents - classroom.currentStudents;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant={isNearlyFull ? "destructive" : "secondary"}
            className="text-xs"
          >
            {spotsLeft} spots left
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
            <Video className="h-4 w-4" />
            <span>Live</span>
          </div>
        </div>

        <CardTitle className="text-xl font-heading text-nihongo-ink-900 group-hover:text-nihongo-crimson-600 transition-colors">
          {classroom.title}
        </CardTitle>

        <p className="text-nihongo-ink-600 text-sm line-clamp-2">
          {classroom.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teacher Info */}
        {classroom.partner && (
          <div className="flex items-center space-x-3 p-3 bg-nihongo-ink-50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${classroom.partner.account?.name}`}
              />
              <AvatarFallback>
                {classroom.partner.account?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-nihongo-ink-900 truncate">
                {classroom.partner.account?.name}
              </p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-nihongo-ink-600">
                  {classroom.partner.averageRating} •{" "}
                  {classroom.partner.teachingExperience}+ years
                </span>
                {classroom.partner.isApproved && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schedule & Capacity */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-nihongo-ink-600">
            <Calendar className="h-4 w-4" />
            <span>{classroom.schedule}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-nihongo-ink-600">
            <Users className="h-4 w-4" />
            <span>
              {classroom.currentStudents}/{classroom.maxStudents} students
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-nihongo-ink-500">
            <span>Capacity</span>
            <span>
              {Math.round(
                (classroom.currentStudents / classroom.maxStudents) * 100,
              )}
              %
            </span>
          </div>
          <div className="w-full bg-nihongo-ink-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isNearlyFull
                  ? "bg-gradient-to-r from-yellow-500 to-red-500"
                  : "bg-gradient-crimson"
              }`}
              style={{
                width: `${(classroom.currentStudents / classroom.maxStudents) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/classrooms/${classroom.classroomId}`}>
              View Details
            </Link>
          </Button>

          {showEnrollButton && (
            <Button
              className="flex-1 bg-gradient-crimson hover:opacity-90 text-white"
              disabled={classroom.currentStudents >= classroom.maxStudents}
            >
              {classroom.currentStudents >= classroom.maxStudents
                ? "Full"
                : "Join Now"}
            </Button>
          )}
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-nihongo-ink-500 pt-2 border-t">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span>Next session starts soon</span>
        </div>
      </CardContent>
    </Card>
  );
}
