import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/UserMenu";
import {
  Menu,
  BookOpen,
  Users,
  GraduationCap,
  User,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Globe },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Classrooms", href: "/classrooms", icon: Users },
  { name: "Teachers", href: "/teachers", icon: GraduationCap },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Mock user data - replace with actual user data from context/state
  const mockUser = {
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki Tanaka",
  };

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-crimson">
              <span className="text-lg font-bold text-white">日</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-heading font-bold text-nihongo-ink-900">
                Nihongo Sekai
              </span>
              <p className="text-xs text-nihongo-ink-600 -mt-1">
                Japanese Learning Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-nihongo-crimson-50 text-nihongo-crimson-700"
                      : "text-nihongo-ink-600 hover:text-nihongo-crimson-600 hover:bg-nihongo-crimson-50/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu
                avatarUrl={mockUser.avatarUrl}
                userName={mockUser.name}
                userEmail={mockUser.email}
              />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-nihongo-ink-600 hover:text-nihongo-crimson-600"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="bg-gradient-crimson hover:opacity-90 text-white shadow-lg"
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-crimson">
                    <span className="text-lg font-bold text-white">日</span>
                  </div>
                  <div>
                    <span className="text-lg font-heading font-bold text-nihongo-ink-900">
                      Nihongo Sekai
                    </span>
                    <p className="text-xs text-nihongo-ink-600 -mt-1">
                      Japanese Learning Platform
                    </p>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-nihongo-crimson-50 text-nihongo-crimson-700"
                            : "text-nihongo-ink-600 hover:text-nihongo-crimson-600 hover:bg-nihongo-crimson-50/50",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Auth Buttons / User Info */}
                <div className="pt-4 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-4 py-3 bg-nihongo-ink-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-gradient-crimson flex items-center justify-center text-white font-medium">
                          {mockUser.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-nihongo-ink-900 truncate">
                            {mockUser.name}
                          </p>
                          <p className="text-xs text-nihongo-ink-500 truncate">
                            {mockUser.email}
                          </p>
                        </div>
                      </div>

                      {/* Mobile User Menu Items */}
                      {[
                        { label: "My Profile", url: "/profile", icon: User },
                        {
                          label: "My Courses",
                          url: "/my-courses",
                          icon: BookOpen,
                        },
                        {
                          label: "My Classrooms",
                          url: "/my-classrooms",
                          icon: Users,
                        },
                        {
                          label: "Transactions",
                          url: "/transactions",
                          icon: GraduationCap,
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            to={item.url}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-nihongo-ink-600 hover:text-nihongo-crimson-600 hover:bg-nihongo-crimson-50/50 transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}

                      {/* Logout Button */}
                      <Button
                        variant="outline"
                        className="w-full justify-start space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          localStorage.removeItem("isAuthenticated");
                          setIsAuthenticated(false);
                          setIsOpen(false);
                        }}
                      >
                        <User className="h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start space-x-2"
                        onClick={() => setIsOpen(false)}
                        asChild
                      >
                        <Link to="/login">
                          <User className="h-4 w-4" />
                          <span>Login</span>
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-gradient-crimson hover:opacity-90 text-white"
                        onClick={() => setIsOpen(false)}
                        asChild
                      >
                        <Link to="/signup">Get Started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
