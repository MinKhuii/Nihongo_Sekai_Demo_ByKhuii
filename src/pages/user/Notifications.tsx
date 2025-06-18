import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  BookOpen,
  Users,
  Calendar,
  Star,
  Gift,
  AlertCircle,
  CheckCircle,
  Trash2,
  Settings,
  Filter,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock notification data
const mockNotifications = [
  {
    id: "notif-1",
    type: "course_update",
    title: "New lesson available in Japanese for Beginners",
    message:
      "A new lesson 'Advanced Hiragana Practice' has been added to your course.",
    timestamp: "2024-03-18T10:30:00Z",
    read: false,
    priority: "normal",
    actionUrl: "/courses/1",
    actionText: "View Lesson",
    icon: BookOpen,
  },
  {
    id: "notif-2",
    type: "classroom_reminder",
    title: "Upcoming class: Morning Conversation Practice",
    message: "Your class with Yuki Tanaka starts in 2 hours. Don't forget!",
    timestamp: "2024-03-20T07:00:00Z",
    read: false,
    priority: "high",
    actionUrl: "/classrooms/1",
    actionText: "Join Class",
    icon: Users,
  },
  {
    id: "notif-3",
    type: "achievement",
    title: "Congratulations! Streak milestone reached",
    message: "You've completed 7 days in a row. Keep up the great work!",
    timestamp: "2024-03-17T20:15:00Z",
    read: true,
    priority: "normal",
    actionUrl: "/profile",
    actionText: "View Progress",
    icon: Star,
  },
  {
    id: "notif-4",
    type: "system",
    title: "Welcome to Nihongo Sekai!",
    message:
      "Thank you for joining our platform. Start your Japanese journey today!",
    timestamp: "2024-03-15T09:00:00Z",
    read: true,
    priority: "low",
    actionUrl: "/courses",
    actionText: "Browse Courses",
    icon: Gift,
  },
  {
    id: "notif-5",
    type: "assignment",
    title: "Assignment due tomorrow",
    message:
      "Don't forget to submit your homework for Business Japanese Workshop.",
    timestamp: "2024-03-19T14:20:00Z",
    read: false,
    priority: "high",
    actionUrl: "/classrooms/3",
    actionText: "View Assignment",
    icon: Calendar,
  },
  {
    id: "notif-6",
    type: "course_completion",
    title: "Course completed successfully!",
    message:
      "You've completed 'Conversational Japanese: Daily Life'. Well done!",
    timestamp: "2024-03-16T16:45:00Z",
    read: true,
    priority: "normal",
    actionUrl: "/my-courses",
    actionText: "View Certificate",
    icon: CheckCircle,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && notification.read) ||
      (readFilter === "unread" && !notification.read);

    return matchesType && matchesRead;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course_update":
        return "bg-green-100 text-green-800";
      case "classroom_reminder":
        return "bg-blue-100 text-blue-800";
      case "achievement":
        return "bg-yellow-100 text-yellow-800";
      case "assignment":
        return "bg-purple-100 text-purple-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NotificationStats = () => (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{notifications.length}</div>
          <p className="text-xs text-muted-foreground">All notifications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unread</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          <p className="text-xs text-muted-foreground">Need attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {notifications.filter((n) => n.priority === "high").length}
          </div>
          <p className="text-xs text-muted-foreground">Urgent items</p>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationList = () => (
    <div className="space-y-4">
      {filteredNotifications.map((notification) => {
        const IconComponent = notification.icon;
        return (
          <Card
            key={notification.id}
            className={`p-4 transition-all ${!notification.read ? "border-l-4 border-l-nihongo-crimson-500 bg-nihongo-crimson-50/30" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    !notification.read
                      ? "bg-nihongo-crimson-100"
                      : "bg-gray-100"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-semibold ${!notification.read ? "text-nihongo-ink-900" : "text-nihongo-ink-700"}`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-nihongo-crimson-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-nihongo-ink-600 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type.replace("_", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {notification.actionUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(notification.id)}
                  >
                    {notification.actionText}
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-nihongo-ink-900">
                Notifications
              </h1>
              <p className="text-nihongo-ink-600 mt-2">
                Stay updated with your learning progress and important updates
              </p>
            </div>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  Mark all as read
                </Button>
              )}
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <NotificationStats />

        {/* Filters */}
        <div className="mb-8 flex items-center space-x-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="course_update">Course Updates</SelectItem>
              <SelectItem value="classroom_reminder">
                Classroom Reminders
              </SelectItem>
              <SelectItem value="achievement">Achievements</SelectItem>
              <SelectItem value="assignment">Assignments</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notification Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All ({filteredNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({filteredNotifications.filter((n) => !n.read).length})
            </TabsTrigger>
            <TabsTrigger value="important">
              Important (
              {
                filteredNotifications.filter((n) => n.priority === "high")
                  .length
              }
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredNotifications.length > 0 ? (
              <NotificationList />
            ) : (
              <Card className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No notifications found
                </h3>
                <p className="text-muted-foreground">
                  {typeFilter !== "all" || readFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You're all caught up!"}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unread">
            <div className="space-y-4">
              {filteredNotifications
                .filter((n) => !n.read)
                .map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <Card
                      key={notification.id}
                      className="p-4 border-l-4 border-l-nihongo-crimson-500 bg-nihongo-crimson-50/30"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-nihongo-crimson-100 rounded-lg">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-nihongo-ink-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-nihongo-ink-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              {notification.actionText}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="important">
            <div className="space-y-4">
              {filteredNotifications
                .filter((n) => n.priority === "high")
                .map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <Card
                      key={notification.id}
                      className="p-4 border-l-4 border-l-red-500 bg-red-50/30"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-red-900">
                              {notification.title}
                            </h3>
                            <Badge className="bg-red-100 text-red-800">
                              URGENT
                            </Badge>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {notification.actionText}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Notifications;
