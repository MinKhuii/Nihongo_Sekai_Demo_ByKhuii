import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Classrooms from "./pages/Classrooms";
import ClassroomDetail from "./pages/ClassroomDetail";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/user/Profile";
import MyCourses from "./pages/user/MyCourses";
import MyClassrooms from "./pages/user/MyClassrooms";
import Transactions from "./pages/user/Transactions";
import Notifications from "./pages/user/Notifications";
import AdminHome from "./pages/admin/AdminHome";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/classrooms/:id" element={<ClassroomDetail />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-classrooms" element={<MyClassrooms />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
