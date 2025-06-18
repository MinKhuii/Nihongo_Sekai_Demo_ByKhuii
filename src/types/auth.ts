// Authentication form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "Learner" | "Teacher";
  avatarUrl?: string;
}

export interface ForgotPasswordFormData {
  email: string;
  otp?: string;
  newPassword?: string;
}

export interface OAuthOptions {
  googleOAuth: boolean;
  facebookOAuth: boolean;
}

// Authentication context types
export interface AuthState {
  isAuthenticated: boolean;
  user: Account | null;
  token: string | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  signup: (userData: SignupFormData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

// API response types
export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: Account;
  message?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: Account;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Import Account from main types
import { Account } from "./index";
