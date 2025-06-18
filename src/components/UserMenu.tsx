import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  BookOpen,
  Users,
  CreditCard,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";

interface MenuItem {
  label: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface UserMenuProps {
  avatarUrl?: string;
  userName?: string;
  userEmail?: string;
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { label: "My Profile", url: "/profile", icon: User },
  { label: "My Courses", url: "/my-courses", icon: BookOpen },
  { label: "My Classrooms", url: "/my-classrooms", icon: Users },
  { label: "Transactions", url: "/transactions", icon: CreditCard },
];

export function UserMenu({
  avatarUrl,
  userName = "User",
  userEmail,
  menuItems = defaultMenuItems,
}: UserMenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authToken");

    // Redirect to login page
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center space-x-2 rounded-full p-1 hover:bg-nihongo-ink-100 transition-colors focus:outline-none focus:ring-2 focus:ring-nihongo-crimson-500 focus:ring-offset-2">
          <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm hover:ring-nihongo-crimson-200 transition-all">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-gradient-crimson text-white text-sm font-medium">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8}>
        {/* User Info Header */}
        <DropdownMenuLabel className="p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-gradient-crimson text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-nihongo-ink-900 truncate">
                {userName}
              </p>
              {userEmail && (
                <p className="text-xs text-nihongo-ink-500 truncate">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <div className="py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={index} asChild>
                <Link
                  to={item.url}
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-nihongo-ink-700 hover:text-nihongo-crimson-600 hover:bg-nihongo-crimson-50 rounded-md transition-colors cursor-pointer"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {/* Additional Actions */}
        <div className="py-1">
          <DropdownMenuItem asChild>
            <Link
              to="/notifications"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-nihongo-ink-700 hover:text-nihongo-crimson-600 hover:bg-nihongo-crimson-50 rounded-md transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-nihongo-ink-700 hover:text-nihongo-crimson-600 hover:bg-nihongo-crimson-50 rounded-md transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer focus:bg-red-50 focus:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
