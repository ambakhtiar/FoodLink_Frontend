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
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.registerUser(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.token);
      toast.success("Registration successful!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed. Please try again.");
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
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Google login failed. Please try again.");
    },
  });
}
