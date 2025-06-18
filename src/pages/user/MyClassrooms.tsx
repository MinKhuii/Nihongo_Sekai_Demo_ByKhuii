import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Clock,
  Video,
  BookOpen,
  Star,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - In real app, this would come from API
const mockEnrolledClassrooms = [
  {
    classroomId: "1",
    title: "Morning Conversation Practice",
    description:
      "Join our morning conversation circle to practice speaking Japanese in a supportive environment.",
    teacher: {
      name: "Yuki Tanaka",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
      rating: 4.9,
    },
    schedule: "Mon, Wed, Fri 9:00 AM JST",
    nextSession: "2024-03-20T09:00:00Z",
    studentsCount: 5,
    maxStudents: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?w=400&h=300&fit=crop",
    status: "active",
    enrolledAt: "2024-01-15T12:00:00Z",
    level: "Beginner-Intermediate",
    language: "Japanese",
    totalSessions: 24,
    attendedSessions: 18,
  },
  {
    classroomId: "2",
    title: "JLPT Study Group",
    description:
      "Intensive study sessions focused on JLPT preparation. We cover grammar, vocabulary, and practice tests together.",
    teacher: {
      name: "Hiroshi Sato",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroshi Sato",
      rating: 4.8,
    },
    schedule: "Tue, Thu 7:00 PM JST",
    nextSession: "2024-03-21T19:00:00Z",
    studentsCount: 7,
    maxStudents: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    status: "active",
    enrolledAt: "2024-02-01T15:30:00Z",
    level: "Intermediate-Advanced",
    language: "Japanese",
    totalSessions: 16,
    attendedSessions: 12,
  },
  {
    classroomId: "3",
    title: "Business Japanese Workshop",
    description:
      "Advanced workshop for professionals. Practice business presentations, meetings, and formal communication.",
    teacher: {
      name: "Yuki Tanaka",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
      rating: 4.9,
    },
    schedule: "Sat 2:00 PM JST",
    nextSession: "2024-03-23T14:00:00Z",
    studentsCount: 4,
    maxStudents: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    status: "active",
    enrolledAt: "2024-02-05T14:20:00Z",
    level: "Advanced",
    language: "Japanese",
    totalSessions: 8,
    attendedSessions: 6,
  },
];

const MyClassrooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [filteredClassrooms, setFilteredClassrooms] = useState(
    mockEnrolledClassrooms,
  );

  useEffect(() => {
    let filtered = mockEnrolledClassrooms.filter((classroom) => {
      const matchesSearch =
        classroom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classroom.teacher.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || classroom.status === statusFilter;
      const matchesLevel =
        levelFilter === "all" ||
        classroom.level.toLowerCase().includes(levelFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesLevel;
    });

    setFilteredClassrooms(filtered);
  }, [searchQuery, statusFilter, levelFilter]);

  const formatNextSession = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    const hoursUntil = Math.round(timeDiff / (1000 * 3600));

    if (hoursUntil < 0) {
      return "Session passed";
    } else if (hoursUntil < 1) {
      return "Starting soon";
    } else if (hoursUntil < 24) {
      return `In ${hoursUntil} hours`;
    } else {
      const daysUntil = Math.round(hoursUntil / 24);
      return `In ${daysUntil} days`;
    }
  };

  const getAttendanceRate = (attended: number, total: number) => {
    return Math.round((attended / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ActiveClassrooms = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredClassrooms.map((classroom) => (
        <Card
          key={classroom.classroomId}
          className="hover:shadow-lg transition-shadow"
        >
          <div className="relative">
            <img
              src={classroom.thumbnail}
              alt={classroom.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Badge
              className={`absolute top-2 right-2 ${getStatusColor(classroom.status)}`}
            >
              {classroom.status}
            </Badge>
          </div>

          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-2 text-lg">
                {classroom.title}
              </CardTitle>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={classroom.teacher.avatar}
                  alt={classroom.teacher.name}
                />
                <AvatarFallback>
                  {classroom.teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{classroom.teacher.name}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {classroom.teacher.rating}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {classroom.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{classroom.schedule}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-nihongo-crimson-600 font-medium">
                  Next: {formatNextSession(classroom.nextSession)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {classroom.studentsCount}/{classroom.maxStudents} students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>
                  Attendance:{" "}
                  {getAttendanceRate(
                    classroom.attendedSessions,
                    classroom.totalSessions,
                  )}
                  %
                </span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button asChild size="sm" className="flex-1">
                <Link to={`/classrooms/${classroom.classroomId}`}>
                  <Video className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const UpcomingSessions = () => {
    const upcomingSessions = filteredClassrooms
      .map((classroom) => ({
        ...classroom,
        nextSessionDate: new Date(classroom.nextSession),
      }))
      .sort(
        (a, b) => a.nextSessionDate.getTime() - b.nextSessionDate.getTime(),
      );

    return (
      <div className="space-y-4">
        {upcomingSessions.slice(0, 5).map((classroom) => (
          <Card key={`session-${classroom.classroomId}`} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={classroom.thumbnail}
                  alt={classroom.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{classroom.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {classroom.teacher.name}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                    <span>{formatNextSession(classroom.nextSession)}</span>
                    <span>{classroom.schedule}</span>
                  </div>
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to={`/classrooms/${classroom.classroomId}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nihongo-ink-900">
            My Classrooms
          </h1>
          <p className="text-nihongo-ink-600 mt-2">
            Manage your enrolled classrooms and upcoming sessions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classrooms or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="classrooms" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="classrooms">
              My Classrooms ({filteredClassrooms.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="classrooms">
            {filteredClassrooms.length > 0 ? (
              <ActiveClassrooms />
            ) : (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No classrooms found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  levelFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You haven't enrolled in any classrooms yet"}
                </p>
                <Button asChild>
                  <Link to="/classrooms">Browse Classrooms</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {filteredClassrooms.length > 0 ? (
              <UpcomingSessions />
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No upcoming sessions
                </h3>
                <p className="text-muted-foreground">
                  Your next sessions will appear here
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyClassrooms;
