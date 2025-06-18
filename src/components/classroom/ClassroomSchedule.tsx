import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Classroom, ScheduleEntry } from "@/types";
import {
  Calendar,
  Clock,
  Video,
  Users,
  ExternalLink,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, parseISO, isAfter, isBefore, addHours } from "date-fns";

interface ClassroomScheduleProps {
  classroom: Classroom;
}

export function ClassroomSchedule({ classroom }: ClassroomScheduleProps) {
  const getSessionStatus = (entry: ScheduleEntry) => {
    const now = new Date();
    const start = parseISO(entry.start);
    const end = parseISO(entry.end);

    if (entry.status === "cancelled") return "cancelled";
    if (entry.status === "completed") return "completed";
    if (isAfter(now, end)) return "completed";
    if (isBefore(now, start) && isAfter(now, addHours(start, -1)))
      return "starting-soon";
    if (isAfter(now, start) && isBefore(now, end)) return "live";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800";
      case "starting-soon":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Play className="h-3 w-3" />;
      case "starting-soon":
        return <AlertCircle className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live Now";
      case "starting-soon":
        return "Starting Soon";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Upcoming";
    }
  };

  const sortedEntries = [...classroom.scheduleEntries].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-nihongo-crimson-600" />
            <span>Class Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-nihongo-ink-50 rounded-lg">
              <Clock className="h-5 w-5 text-nihongo-crimson-600" />
              <div>
                <p className="font-medium">Regular Schedule</p>
                <p className="text-sm text-nihongo-ink-600">
                  {classroom.schedule}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-nihongo-ink-50 rounded-lg">
              <Users className="h-5 w-5 text-nihongo-crimson-600" />
              <div>
                <p className="font-medium">Class Size</p>
                <p className="text-sm text-nihongo-ink-600">
                  {classroom.currentStudents}/{classroom.maxStudents} students
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-nihongo-ink-400 mx-auto mb-4" />
              <p className="text-nihongo-ink-600">No scheduled sessions yet</p>
              <p className="text-sm text-nihongo-ink-500">
                The teacher will post the schedule soon
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEntries.map((entry) => {
                const status = getSessionStatus(entry);
                const start = parseISO(entry.start);
                const end = parseISO(entry.end);

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border border-nihongo-ink-200 rounded-lg hover:border-nihongo-crimson-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <div className="text-lg font-bold text-nihongo-ink-900">
                          {format(start, "dd")}
                        </div>
                        <div className="text-sm text-nihongo-ink-600">
                          {format(start, "MMM")}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-nihongo-ink-900">
                            {entry.topic || "Class Session"}
                          </h4>
                          <Badge className={getStatusColor(status)}>
                            {getStatusIcon(status)}
                            <span className="ml-1">
                              {getStatusText(status)}
                            </span>
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-nihongo-ink-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(start, "HH:mm")} - {format(end, "HH:mm")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Video className="h-3 w-3" />
                            <span>Live Session</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {status === "live" && (
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => window.open(entry.joinUrl, "_blank")}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Now
                        </Button>
                      )}

                      {status === "starting-soon" && (
                        <Button
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => window.open(entry.joinUrl, "_blank")}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Get Ready
                        </Button>
                      )}

                      {status === "upcoming" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Add to calendar functionality
                            const startDate =
                              start
                                .toISOString()
                                .replace(/[-:]/g, "")
                                .split(".")[0] + "Z";
                            const endDate =
                              end
                                .toISOString()
                                .replace(/[-:]/g, "")
                                .split(".")[0] + "Z";
                            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(entry.topic || "Japanese Class")}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`Join: ${entry.joinUrl}`)}&location=${encodeURIComponent("Online")}`;
                            window.open(calendarUrl, "_blank");
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Add to Calendar
                        </Button>
                      )}

                      {(status === "completed" || status === "cancelled") && (
                        <Button variant="ghost" disabled>
                          {status === "completed" ? "Completed" : "Cancelled"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Join */}
      {classroom.videoCallLink && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-nihongo-crimson-50 to-nihongo-sakura-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-nihongo-ink-900 mb-2">
                  Quick Access
                </h3>
                <p className="text-sm text-nihongo-ink-600">
                  Direct link to join classroom sessions
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(classroom.videoCallLink, "_blank")}
                className="border-nihongo-crimson-200 hover:bg-nihongo-crimson-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Classroom Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
