import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminAnalytics } from "@/types/admin";
import { mockAdminAnalytics } from "@/data/adminMockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Percent,
  ShoppingCart,
  Download,
  Calendar,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAnalytics(mockAdminAnalytics);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-nihongo-ink-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-nihongo-ink-900">
            {format(parseISO(label), "MMM d, yyyy")}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name.includes("Revenue")
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const kpiCards = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue || 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: "+23.1%",
      trendUp: true,
      formatter: formatCurrency,
    },
    {
      title: "Total Signups",
      value: analytics?.totalSignups || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12.5%",
      trendUp: true,
      formatter: formatNumber,
    },
    {
      title: "Conversion Rate",
      value: analytics?.conversionRate || 0,
      icon: Percent,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+2.3%",
      trendUp: true,
      formatter: (val: number) => `${val}%`,
    },
    {
      title: "Avg Order Value",
      value: analytics?.averageOrderValue || 0,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "+8.7%",
      trendUp: true,
      formatter: formatCurrency,
    },
  ];

  // Sample data for additional charts
  const coursePopularityData = [
    { name: "Beginner Japanese", students: 1247, color: "#dc2626" },
    { name: "Business Japanese", students: 892, color: "#ea580c" },
    { name: "JLPT Prep", students: 723, color: "#ca8a04" },
    { name: "Conversation", students: 634, color: "#16a34a" },
    { name: "Cultural Studies", students: 456, color: "#2563eb" },
  ];

  const userGrowthData =
    analytics?.signupTrend.map((item, index) => ({
      ...item,
      cumulative: analytics.signupTrend
        .slice(0, index + 1)
        .reduce((sum, curr) => sum + curr.count, 0),
    })) || [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-nihongo-ink-900">
                  Analytics Dashboard
                </h1>
                <p className="text-nihongo-ink-600 mt-2">
                  Monitor your platform's performance and growth
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span
                            className={
                              kpi.trendUp ? "text-green-600" : "text-red-600"
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

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Signup Trend Line Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-nihongo-crimson-600" />
                  <span>Daily Signups</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics?.signupTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          format(parseISO(value), "MMM d")
                        }
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#dc2626"
                        fill="#dc2626"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name="Signups"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Revenue Trend Bar Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-nihongo-crimson-600" />
                  <span>Daily Revenue</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.salesTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          format(parseISO(value), "MMM d")
                        }
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="revenue"
                        fill="#dc2626"
                        radius={[4, 4, 0, 0]}
                        name="Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Course Popularity Pie Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Course Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={coursePopularityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="students"
                    >
                      {coursePopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} students`, "Students"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {coursePopularityData.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm text-nihongo-ink-700">
                          {course.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-nihongo-ink-900">
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Cumulative User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        format(parseISO(value), "MMM d")
                      }
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                      name="Total Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
