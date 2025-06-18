import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassroomSchedule } from "@/components/classroom/ClassroomSchedule";
import { ClassroomFeed } from "@/components/classroom/ClassroomFeed";
import { ApiService } from "@/lib/api";
import { Classroom } from "@/types";
import {
  ArrowLeft,
  Users,
  Star,
  Clock,
  Calendar,
  Video,
  CheckCircle,
  MessageSquare,
  BookOpen,
} from "lucide-react";

export default function ClassroomDetail() {
  const { id } = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadClassroom = async () => {
      if (!id) {
        setError("Classroom ID not provided");
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.getClassroom(id);
        if (response.success) {
          setClassroom(response.data);
        } else {
          setError(response.message || "Classroom not found");
        }
      } catch (err) {
        setError("Failed to load classroom details");
      } finally {
        setLoading(false);
      }
    };

    loadClassroom();
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

  if (error || !classroom) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-nihongo">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nihongo-ink-100">
                <Users className="h-8 w-8 text-nihongo-ink-400" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-nihongo-ink-900 mb-4">
                Classroom Not Found
              </h1>
              <p className="text-nihongo-ink-600 mb-8">
                {error || "The classroom you're looking for doesn't exist."}
              </p>
              <Button asChild>
                <Link to="/classrooms">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Classrooms
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const isNearlyFull = classroom.currentStudents / classroom.maxStudents > 0.8;
  const spotsLeft = classroom.maxStudents - classroom.currentStudents;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                to="/classrooms"
                className="text-nihongo-ink-600 hover:text-nihongo-crimson-600 flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                All Classrooms
              </Link>
              <span className="text-nihongo-ink-400">/</span>
              <span className="text-nihongo-ink-900">{classroom.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Classroom Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge
                    variant={isNearlyFull ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {spotsLeft} spots left
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
                    <Video className="h-4 w-4" />
                    <span>Live Sessions</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
                    <Clock className="h-4 w-4" />
                    <span>{classroom.schedule}</span>
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900 mb-4">
                  {classroom.title}
                </h1>

                <p className="text-lg text-nihongo-ink-600 mb-6">
                  {classroom.description}
                </p>

                {/* Teacher Info */}
                {classroom.partner && (
                  <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${classroom.partner.account?.name}`}
                      />
                      <AvatarFallback>
                        {classroom.partner.account?.name?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-nihongo-ink-900">
                        {classroom.partner.account?.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-nihongo-ink-600">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{classroom.partner.averageRating}</span>
                        </div>
                        <span>
                          {classroom.partner.teachingExperience}+ years
                          experience
                        </span>
                        {classroom.partner.isApproved && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Classroom Image */}
              <div className="mb-8">
                <img
                  src={classroom.thumbnail}
                  alt={classroom.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="feed"
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Feed</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>About This Classroom</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          What You'll Learn
                        </h4>
                        <p className="text-nihongo-ink-600">
                          {classroom.description}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Schedule</h4>
                          <p className="text-nihongo-ink-600">
                            {classroom.schedule}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Class Size</h4>
                          <p className="text-nihongo-ink-600">
                            {classroom.currentStudents}/{classroom.maxStudents}{" "}
                            students
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Prerequisites</h4>
                        <ul className="text-nihongo-ink-600 space-y-1">
                          <li>
                            • Basic understanding of hiragana and katakana
                          </li>
                          <li>• Willingness to practice speaking</li>
                          <li>• Stable internet connection for video calls</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="mt-6">
                  <ClassroomSchedule classroom={classroom} />
                </TabsContent>

                <TabsContent value="feed" className="mt-6">
                  <ClassroomFeed classroom={classroom} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="border-0 shadow-lg sticky top-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-nihongo-crimson-600 mb-2">
                      Free
                    </div>
                    <p className="text-nihongo-ink-600">Join this classroom</p>
                  </div>

                  {/* Capacity Progress */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Capacity</span>
                      <span className="font-medium">
                        {classroom.currentStudents}/{classroom.maxStudents}
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
                    <p className="text-sm text-nihongo-ink-500">
                      {spotsLeft} spots remaining
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Teacher</span>
                      <span className="font-medium">
                        {classroom.partner?.account?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Schedule</span>
                      <span className="font-medium">{classroom.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Students</span>
                      <span className="font-medium">
                        {classroom.currentStudents}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-nihongo-ink-600">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {classroom.partner?.averageRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-crimson hover:opacity-90 text-white shadow-lg"
                      disabled={
                        classroom.currentStudents >= classroom.maxStudents
                      }
                    >
                      {classroom.currentStudents >= classroom.maxStudents
                        ? "Classroom Full"
                        : "Join Classroom"}
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save for Later
                    </Button>
                  </div>

                  <div className="text-center mt-6 text-sm text-nihongo-ink-500">
                    <p>Free to join • Cancel anytime</p>
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
