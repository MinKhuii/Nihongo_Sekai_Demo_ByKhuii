import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { CourseCard } from "@/components/CourseCard";
import { ClassroomCard } from "@/components/ClassroomCard";
import { StatsCard } from "@/components/StatsCard";
import { ApiService } from "@/lib/api";
import { Course, Classroom } from "@/types";
import {
  BookOpen,
  Users,
  Star,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Target,
} from "lucide-react";

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularClassrooms, setPopularClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesResponse, classroomsResponse] = await Promise.all([
          ApiService.getFeaturedCourses(),
          ApiService.getClassrooms({ pageSize: 2 }),
        ]);

        if (coursesResponse.success) {
          setFeaturedCourses(coursesResponse.data.slice(0, 3));
        }

        setPopularClassrooms(classroomsResponse.data.slice(0, 2));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description:
        "Learn at your own pace with our comprehensive courses designed by native speakers and language experts.",
    },
    {
      icon: Users,
      title: "Live Classrooms",
      description:
        "Join virtual classrooms with certified teachers and practice with fellow learners from around the world.",
    },
    {
      icon: Target,
      title: "JLPT Preparation",
      description:
        "Specialized courses and practice tests to help you pass the Japanese Language Proficiency Test.",
    },
    {
      icon: Globe,
      title: "Cultural Immersion",
      description:
        "Discover Japanese culture, traditions, and modern society through engaging content and activities.",
    },
  ];

  const stats = [
    { label: "Active Learners", value: "25,000+", icon: Users },
    { label: "Courses Available", value: "150+", icon: BookOpen },
    { label: "Certified Teachers", value: "80+", icon: Award },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
  ];

  const learningPaths = [
    {
      title: "Complete Beginner",
      description: "Start from zero with hiragana, katakana, and basic phrases",
      duration: "3-6 months",
      courses: 8,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "JLPT Preparation",
      description: "Structured path to pass N5 to N1 proficiency tests",
      duration: "6-24 months",
      courses: 15,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Business Japanese",
      description: "Professional communication and workplace culture",
      duration: "4-8 months",
      courses: 6,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nihongo-crimson-50 via-white to-nihongo-sakura-50" />
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20'
          }
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-nihongo-crimson-100 text-nihongo-crimson-800 hover:bg-nihongo-crimson-200">
                🇯🇵 #1 Japanese Learning Platform
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-heading font-bold text-nihongo-ink-900 mb-6 leading-tight">
                Master Japanese
                <br />
                <span className="bg-gradient-crimson bg-clip-text text-transparent">
                  Language & Culture
                </span>
              </h1>

              <p className="text-xl text-nihongo-ink-600 mb-8 max-w-lg">
                Join thousands of learners on an immersive journey through
                Japanese language, culture, and traditions with expert guidance
                and interactive learning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-crimson hover:opacity-90 text-white shadow-lg text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/courses">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-nihongo-crimson-200 hover:bg-nihongo-crimson-50"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-sm text-nihongo-ink-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">4.9/5</span>
                  <span>rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>25,000+ learners</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>94% success rate</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative bg-gradient-to-br from-nihongo-crimson-100 to-nihongo-sakura-100 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl lg:text-9xl font-bold text-nihongo-crimson-600 mb-4">
                      日本語
                    </div>
                    <p className="text-lg text-nihongo-ink-700 font-medium">
                      Your Journey Starts Here
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 animate-bounce">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Session</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="text-2xl font-bold text-nihongo-crimson-600">
                  25,000+
                </div>
                <div className="text-sm text-nihongo-ink-600">
                  Happy Learners
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-nihongo-sakura-100 text-nihongo-sakura-800">
              Why Choose Nihongo Sekai
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900 mb-6">
              Everything You Need to
              <br />
              <span className="text-nihongo-crimson-600">Master Japanese</span>
            </h2>
            <p className="text-xl text-nihongo-ink-600 max-w-3xl mx-auto">
              Our comprehensive platform combines structured learning, live
              interaction, and cultural immersion to accelerate your Japanese
              language journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-crimson">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-heading text-nihongo-ink-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-nihongo-ink-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 bg-gradient-to-br from-nihongo-ink-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-nihongo-gold-100 text-nihongo-gold-800">
              Learning Paths
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900 mb-6">
              Find Your Perfect
              <br />
              <span className="text-nihongo-crimson-600">Learning Journey</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={path.color}>{path.title}</Badge>
                    <div className="text-sm text-nihongo-ink-500">
                      {path.courses} courses
                    </div>
                  </div>
                  <CardTitle className="text-xl font-heading text-nihongo-ink-900">
                    {path.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-nihongo-ink-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{path.duration}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Explore Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-nihongo-crimson-100 text-nihongo-crimson-800">
                Featured Courses
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900">
                Popular Courses This Month
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 animate-pulse rounded-lg h-80"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Live Classrooms Section */}
      <section className="py-20 bg-gradient-to-br from-nihongo-sakura-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-nihongo-sakura-100 text-nihongo-sakura-800">
                Live Learning
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-nihongo-ink-900">
                Join Live Classrooms
              </h2>
              <p className="text-xl text-nihongo-ink-600 mt-4">
                Practice with native speakers and fellow learners in real-time
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/classrooms">
                View All Classrooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {popularClassrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.classroomId}
                classroom={classroom}
                showEnrollButton
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-crimson text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of learners who have transformed their lives through
            Japanese language and culture. Your adventure begins today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-nihongo-crimson-600 hover:bg-gray-50"
              asChild
            >
              <Link to="/courses">
                Browse Courses
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-nihongo-crimson-600"
              asChild
            >
              <Link to="/classrooms">
                Find Teachers
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
