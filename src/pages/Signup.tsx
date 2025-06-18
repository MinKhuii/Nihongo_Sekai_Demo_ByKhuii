import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AvatarUpload } from "@/components/auth/AvatarUpload";
import { SignupFormData } from "@/types/auth";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["Learner", "Teacher"]),
    avatarUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "Learner",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Signup attempt:", data);

      // Mock successful signup
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-nihongo flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center pb-6">
              {/* Logo */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-crimson">
                <span className="text-2xl font-bold text-white">日</span>
              </div>

              <CardTitle className="text-2xl font-heading font-bold text-nihongo-ink-900">
                Join Nihongo Sekai
              </CardTitle>
              <p className="text-nihongo-ink-600 mt-2">
                Create your account to start learning Japanese
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex justify-center">
                  <AvatarUpload
                    onUpload={(url) => setValue("avatarUrl", url)}
                    currentAvatar={watch("avatarUrl")}
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-nihongo-ink-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={cn(
                        "pl-10",
                        errors.name && "border-red-500 focus:ring-red-500",
                      )}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-nihongo-ink-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={cn(
                        "pl-10",
                        errors.email && "border-red-500 focus:ring-red-500",
                      )}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-nihongo-ink-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={cn(
                        "pl-10 pr-10",
                        errors.password && "border-red-500 focus:ring-red-500",
                      )}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-4 w-4 text-nihongo-ink-400 hover:text-nihongo-ink-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-nihongo-ink-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={cn(
                        "pl-10 pr-10",
                        errors.confirmPassword &&
                          "border-red-500 focus:ring-red-500",
                      )}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-4 w-4 text-nihongo-ink-400 hover:text-nihongo-ink-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-nihongo-ink-700">
                    I want to join as a:
                  </Label>
                  <RadioGroup
                    value={selectedRole}
                    onValueChange={(value: "Learner" | "Teacher") =>
                      setValue("role", value)
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="learner"
                        className={cn(
                          "flex flex-col items-center space-y-3 rounded-lg border-2 border-dashed p-4 cursor-pointer hover:bg-nihongo-ink-50 transition-colors",
                          selectedRole === "Learner"
                            ? "border-nihongo-crimson-600 bg-nihongo-crimson-50"
                            : "border-nihongo-ink-200",
                        )}
                      >
                        <BookOpen
                          className={cn(
                            "h-8 w-8",
                            selectedRole === "Learner"
                              ? "text-nihongo-crimson-600"
                              : "text-nihongo-ink-400",
                          )}
                        />
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium">Learner</p>
                          <p className="text-xs text-nihongo-ink-500">
                            Learn Japanese language and culture
                          </p>
                        </div>
                        <RadioGroupItem
                          value="Learner"
                          id="learner"
                          className="sr-only"
                        />
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="teacher"
                        className={cn(
                          "flex flex-col items-center space-y-3 rounded-lg border-2 border-dashed p-4 cursor-pointer hover:bg-nihongo-ink-50 transition-colors",
                          selectedRole === "Teacher"
                            ? "border-nihongo-crimson-600 bg-nihongo-crimson-50"
                            : "border-nihongo-ink-200",
                        )}
                      >
                        <GraduationCap
                          className={cn(
                            "h-8 w-8",
                            selectedRole === "Teacher"
                              ? "text-nihongo-crimson-600"
                              : "text-nihongo-ink-400",
                          )}
                        />
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium">Teacher</p>
                          <p className="text-xs text-nihongo-ink-500">
                            Teach and share Japanese knowledge
                          </p>
                        </div>
                        <RadioGroupItem
                          value="Teacher"
                          id="teacher"
                          className="sr-only"
                        />
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.role && (
                    <p className="text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-crimson hover:opacity-90 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-nihongo-ink-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-nihongo-crimson-600 hover:text-nihongo-crimson-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
