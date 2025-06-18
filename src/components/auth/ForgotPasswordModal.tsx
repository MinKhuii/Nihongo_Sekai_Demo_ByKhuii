import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgotPasswordFormData } from "@/types/auth";
import { Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

type Step = "email" | "otp" | "success";

export function ForgotPasswordModal({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(resetSchema),
  });

  const handleSendOTP = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Sending OTP to:", data.email);

      setUserEmail(data.email);
      resetForm.setValue("email", data.email);
      setStep("otp");
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Resetting password:", data);

      setStep("success");
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset modal state after animation
    setTimeout(() => {
      setStep("email");
      setUserEmail("");
      emailForm.reset();
      resetForm.reset();
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-nihongo-crimson-100">
            {step === "success" ? (
              <CheckCircle className="h-6 w-6 text-nihongo-crimson-600" />
            ) : (
              <Lock className="h-6 w-6 text-nihongo-crimson-600" />
            )}
          </div>
          <DialogTitle className="text-xl font-heading font-bold">
            {step === "email" && "Forgot Password?"}
            {step === "otp" && "Reset Your Password"}
            {step === "success" && "Password Reset Successful"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" &&
              "Enter your email address and we'll send you an OTP to reset your password."}
            {step === "otp" &&
              `We've sent a 6-digit OTP to ${userEmail}. Enter it below with your new password.`}
            {step === "success" &&
              "Your password has been successfully reset. You can now log in with your new password."}
          </DialogDescription>
        </DialogHeader>

        {step === "email" && (
          <form
            onSubmit={emailForm.handleSubmit(handleSendOTP)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-nihongo-ink-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  className={cn(
                    "pl-10",
                    emailForm.formState.errors.email &&
                      "border-red-500 focus:ring-red-500",
                  )}
                  {...emailForm.register("email")}
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-crimson hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-nihongo-ink-700">
                6-Digit OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                className={cn(
                  "text-center text-lg tracking-widest",
                  resetForm.formState.errors.otp &&
                    "border-red-500 focus:ring-red-500",
                )}
                {...resetForm.register("otp")}
              />
              {resetForm.formState.errors.otp && (
                <p className="text-sm text-red-600">
                  {resetForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-nihongo-ink-700">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-nihongo-ink-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className={cn(
                    "pl-10",
                    resetForm.formState.errors.newPassword &&
                      "border-red-500 focus:ring-red-500",
                  )}
                  {...resetForm.register("newPassword")}
                />
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="text-sm text-red-600">
                  {resetForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep("email")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-crimson hover:opacity-90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-crimson hover:opacity-90 text-white"
            >
              Continue to Login
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
