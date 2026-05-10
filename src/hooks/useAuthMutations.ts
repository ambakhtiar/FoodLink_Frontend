"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, type AuthResponse } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import type { LoginInput, RegisterInput, GoogleLoginInput } from "@/lib/validations/auth";

export function useLoginMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginInput) => authService.loginUser(credentials),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      toast.success("Login successful!");
      
      // Attempt to find callbackUrl from query params if possible, otherwise default to Home
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || "/");
    },
    onError: (error: any) => {
      // Backend error message or fallback
      const message = error.response?.data?.message || error.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.registerUser(data),
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "Registration successful! Please login.");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      toast.error(message);
    },
  });
}

export function useGoogleLoginMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: GoogleLoginInput) => authService.googleLogin(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      toast.success("Google login successful!");
      
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || "/");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Google login failed. Please try again.";
      toast.error(message);
    },
  });
}
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "OTP sent to your email!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Failed to send OTP.";
      toast.error(message);
    },
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => authService.verifyOtp(email, otp),
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "OTP verified successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Invalid OTP.";
      toast.error(message);
    },
  });
}

export function useResetPasswordMutation() {
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data: any) => authService.resetPassword(data),
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "Password reset successful! Please login.");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Failed to reset password.";
      toast.error(message);
    },
  });
}
