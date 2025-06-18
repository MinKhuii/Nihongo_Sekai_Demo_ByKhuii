import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiService } from "@/lib/api";
import { Partner } from "@/types";
import {
  ArrowLeft,
  Star,
  GraduationCap,
  Users,
  MessageCircle,
  CheckCircle,
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Globe,
  MapPin,
  Languages,
  Video,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bio");

  useEffect(() => {
    const loadTeacher = async () => {
      if (!id) {
        setError("Teacher ID not provided");
        setLoading(false);
        return;
      }

      try {
        const response = await ApiService.getPartner(id);
        if (response.success) {
          setTeacher(response.data);
        } else {
          setError(response.message || "Teacher not found");
        }
      } catch (err) {
        setError("Failed to load teacher profile");
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
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

  if (error || !teacher) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-nihongo">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nihongo-ink-100">
                <GraduationCap className="h-8 w-8 text-nihongo-ink-400" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-nihongo-ink-900 mb-4">
                Teacher Not Found
              </h1>
              <p className="text-nihongo-ink-600 mb-8">
                {error || "The teacher you're looking for doesn't exist."}
              </p>
              <Button asChild>
                <Link to="/teachers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Teachers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const totalStudents = teacher.coursesTaught.reduce(
    (sum, course) => sum + course.studentsCount,
    0,
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                to="/teachers"
                className="text-nihongo-ink-600 hover:text-nihongo-crimson-600 flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                All Teachers
              </Link>
              <span className="text-nihongo-ink-400">/</span>
              <span className="text-nihongo-ink-900">
                {teacher.account?.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Teacher Header */}
              <Card className="border-0 shadow-lg mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                        <AvatarImage src={teacher.avatarUrl} />
                        <AvatarFallback className="bg-gradient-crimson text-white text-2xl">
                          {teacher.account?.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      {teacher.isApproved && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-nihongo-ink-900">
                          {teacher.account?.name}
                        </h1>
                        {teacher.isApproved && (
                          <Badge className="bg-green-100 text-green-800">
                            Verified Teacher
                          </Badge>
                        )}
                      </div>

                      <p className="text-lg text-nihongo-ink-600 mb-4">
                        {teacher.shortBio}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-nihongo-ink-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">
                            {teacher.averageRating}
                          </span>
                          <span>rating</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>
                            {teacher.teachingExperience}+ years experience
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {totalStudents.toLocaleString()} students taught
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>
                            {teacher.certifications.length} certifications
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-nihongo-ink-500">
                        <Languages className="h-4 w-4" />
                        <span>{teacher.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="border-0 shadow-lg mb-8">
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((spec) => (
                      <Badge
                        key={spec}
                        className="bg-nihongo-crimson-100 text-nihongo-crimson-800 hover:bg-nihongo-crimson-200"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="bio">Bio</TabsTrigger>
                  <TabsTrigger value="certifications">
                    Certifications
                  </TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
                </TabsList>

                <TabsContent value="bio" className="mt-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>About {teacher.account?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                      <p className="text-nihongo-ink-700 whitespace-pre-wrap leading-relaxed">
                        {teacher.bio}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="certifications" className="mt-6">
                  <div className="space-y-4">
                    {teacher.certifications.length === 0 ? (
                      <Card className="border-0 shadow-lg">
                        <CardContent className="text-center py-12">
                          <Award className="h-12 w-12 text-nihongo-ink-400 mx-auto mb-4" />
                          <p className="text-nihongo-ink-600">
                            No certifications listed yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      teacher.certifications.map((cert) => (
                        <Card key={cert.id} className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="p-3 bg-nihongo-gold-100 rounded-lg">
                                <Award className="h-6 w-6 text-nihongo-gold-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-nihongo-ink-900 mb-1">
                                  {cert.title}
                                </h3>
                                <p className="text-nihongo-ink-600 mb-2">
                                  {cert.issuer}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-nihongo-ink-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {format(parseISO(cert.date), "MMMM yyyy")}
                                    </span>
                                  </div>
                                  {cert.credentialId && (
                                    <span>ID: {cert.credentialId}</span>
                                  )}
                                </div>
                                {cert.verificationUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() =>
                                      window.open(
                                        cert.verificationUrl,
                                        "_blank",
                                      )
                                    }
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Verify
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="mt-6">
                  <div className="space-y-4">
                    {teacher.coursesTaught.length === 0 ? (
                      <Card className="border-0 shadow-lg">
                        <CardContent className="text-center py-12">
                          <BookOpen className="h-12 w-12 text-nihongo-ink-400 mx-auto mb-4" />
                          <p className="text-nihongo-ink-600">
                            No courses taught yet
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      teacher.coursesTaught.map((course) => (
                        <Card key={course.id} className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-nihongo-ink-900 mb-2">
                                  {course.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-nihongo-ink-500">
                                  <Badge variant="outline">
                                    {course.level}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {course.studentsCount.toLocaleString()}{" "}
                                      students
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span>{course.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/courses/${course.id}`}>
                                  View Course
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="classrooms" className="mt-6">
                  <div className="space-y-4">
                    {teacher.classroomsHosted.length === 0 ? (
                      <Card className="border-0 shadow-lg">
                        <CardContent className="text-center py-12">
                          <Video className="h-12 w-12 text-nihongo-ink-400 mx-auto mb-4" />
                          <p className="text-nihongo-ink-600">
                            No active classrooms
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      teacher.classroomsHosted.map((classroom) => (
                        <Card key={classroom.id} className="border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-nihongo-ink-900">
                                    {classroom.title}
                                  </h3>
                                  {classroom.isActive && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Active
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-nihongo-ink-500">
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {classroom.studentsCount} students
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{classroom.schedule}</span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/classrooms/${classroom.id}`}>
                                  View Classroom
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="border-0 shadow-lg sticky top-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Connect with {teacher.account?.name}
                    </h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-crimson hover:opacity-90 text-white shadow-lg">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Video className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-nihongo-crimson-600">
                        {teacher.averageRating}
                      </div>
                      <div className="flex justify-center mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(teacher.averageRating)
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-nihongo-ink-500">
                        Average Rating
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-nihongo-crimson-600">
                          {totalStudents.toLocaleString()}
                        </div>
                        <div className="text-xs text-nihongo-ink-500">
                          Total Students
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-nihongo-crimson-600">
                          {teacher.coursesTaught.length}
                        </div>
                        <div className="text-xs text-nihongo-ink-500">
                          Courses
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-nihongo-ink-500">
                    <p>Response time: Usually within 24 hours</p>
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
