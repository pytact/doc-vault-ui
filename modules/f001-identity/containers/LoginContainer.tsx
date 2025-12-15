/**
 * Login Container Component
 * SCR_LOGIN - Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useAuth";
import { useAuthContext } from "@/contexts/auth.context";
import { useNotificationContext } from "@/contexts/notification.context";
import type { LoginFormSchema } from "../hooks/useLoginForm";
import { getRoleBasedDashboardRoute } from "@/utils/routing";

/**
 * Login container component
 * Handles business logic and API calls via hooks
 */
export function LoginContainer() {
  const router = useRouter();
  const { login, user } = useAuthContext();
  const { addNotification } = useNotificationContext();
  const loginMutation = useLogin();

  const handleSubmit = async (data: LoginFormSchema) => {
    try {
      const response = await login(data.email, data.password);
      addNotification({
        type: "success",
        message: "Login successful",
        title: "Welcome back!",
      });
      
      // Redirect to role-based dashboard using the logged-in user's role from response
      const loggedInUser = response?.data?.user;
      if (loggedInUser?.role) {
        const dashboardRoute = getRoleBasedDashboardRoute(loggedInUser.role);
        router.push(dashboardRoute);
      } else {
        // Fallback to default dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      // Error is already handled by mutation
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Login Failed",
      });
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isLoading={loginMutation.isPending}
      error={loginMutation.error?.message || null}
    />
  );
}

