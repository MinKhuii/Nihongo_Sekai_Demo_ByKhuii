import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminKPIs } from "@/types/admin";
import { mockAdminKPIs } from "@/data/adminMockData";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Settings,
  BarChart3,
  UserCheck,
  Plus,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminHome() {
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadKPIs = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setKpis(mockAdminKPIs);
      } catch (error) {
        console.error("Error loading KPIs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadKPIs();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const kpiCards = [
    {
      title: "Total Users",
      value: kpis?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12.5%",
      trendUp: true,
      formatter: formatNumber,
    },
    {
      title: "Total Courses",
      value: kpis?.totalCourses || 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+8.2%",
      trendUp: true,
      formatter: formatNumber,
    },
    {
      title: "Pending Teachers",
      value: kpis?.pendingTeacherApps || 0,
      icon: GraduationCap,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "5 new today",
      trendUp: false,
      formatter: formatNumber,
    },
    {
      title: "Monthly Revenue",
      value: kpis?.monthlyRevenue || 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: "+23.1%",
      trendUp: true,
      formatter: formatCurrency,
    },
  ];

  const quickActions = [
    {
      title: "Manage Courses",
      description: "Create, edit, and publish courses",
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-nihongo-crimson-600 hover:bg-nihongo-crimson-700",
    },
    {
      title: "Manage Teachers",
      description: "Review and approve teacher applications",
      icon: GraduationCap,
      href: "/admin/teachers",
      color: "bg-nihongo-sakura-600 hover:bg-nihongo-sakura-700",
      badge: kpis?.pendingTeacherApps,
    },
    {
      title: "View Analytics",
      description: "Monitor platform performance and trends",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-nihongo-gold-600 hover:bg-nihongo-gold-700",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-nihongo-ink-600 hover:bg-nihongo-ink-700",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-nihongo-ink-900">
                  Admin Dashboard
                </h1>
                <p className="text-nihongo-ink-600 mt-2">
                  Welcome back! Here's what's happening on your platform.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button className="bg-gradient-crimson hover:opacity-90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Actions
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
                        <Icon className={cn("h-6 w-6", kpi.color)} />
                      </div>
                      {loading ? (
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <div className="flex items-center space-x-1 text-sm">
                          {kpi.trendUp ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-orange-600" />
                          )}
                          <span
                            className={
                              kpi.trendUp ? "text-green-600" : "text-orange-600"
                            }
                          >
                            {kpi.trend}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-nihongo-ink-600 mb-1">
                        {kpi.title}
                      </p>
                      {loading ? (
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <p className="text-2xl font-bold text-nihongo-ink-900">
                          {kpi.formatter(kpi.value)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                  asChild
                >
                  <Link to={action.href}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={cn(
                            "p-3 rounded-lg text-white",
                            action.color,
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        {action.badge && (
                          <Badge className="bg-red-100 text-red-800">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-nihongo-ink-900 mb-2 group-hover:text-nihongo-crimson-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-nihongo-ink-600">
                        {action.description}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Course Activity
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/courses">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New course published",
                      course: "Advanced Kanji Mastery",
                      time: "2 hours ago",
                      type: "success",
                    },
                    {
                      action: "Course updated",
                      course: "Business Japanese Basics",
                      time: "5 hours ago",
                      type: "info",
                    },
                    {
                      action: "Course review completed",
                      course: "Anime Japanese for Beginners",
                      time: "1 day ago",
                      type: "success",
                    },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 p-3 bg-nihongo-ink-50 rounded-lg"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          activity.type === "success"
                            ? "bg-green-500"
                            : "bg-blue-500",
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-nihongo-ink-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-nihongo-ink-600">
                          {activity.course} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pending Approvals
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/teachers">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Review All
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Emiko Nakamura",
                      type: "Teacher Application",
                      time: "3 hours ago",
                      priority: "high",
                    },
                    {
                      name: "Kenji Yoshida",
                      type: "Teacher Application",
                      time: "1 day ago",
                      priority: "medium",
                    },
                    {
                      name: "Advanced Grammar Course",
                      type: "Course Review",
                      time: "2 days ago",
                      priority: "low",
                    },
                  ].map((pending, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-nihongo-ink-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-nihongo-ink-900">
                          {pending.name}
                        </p>
                        <p className="text-xs text-nihongo-ink-600">
                          {pending.type} • {pending.time}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          pending.priority === "high" &&
                            "border-red-200 text-red-700",
                          pending.priority === "medium" &&
                            "border-yellow-200 text-yellow-700",
                          pending.priority === "low" &&
                            "border-green-200 text-green-700",
                        )}
                      >
                        {pending.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
