/**
 * Login Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginForm } from "./login.form";
import { LoginSchema, loginDefaultValues, type LoginFormSchema } from "./login.schema";
import { useLoginFormSubmit } from "./useLoginFormSubmit";
import { useAuthContext } from "@/contexts/auth.context";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import { getRoleBasedDashboardRoute } from "@/utils/routing";

/**
 * Login form container component
 * Handles business logic, API calls, and error mapping
 */
export function LoginFormContainer() {
  const router = useRouter();
  const { login } = useAuthContext();
  const { addNotification } = useNotificationContext();
  const { submit, isLoading, error } = useLoginFormSubmit();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: loginDefaultValues,
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      // Check if error is APIErrorResponse format
      const apiError = error && typeof error === 'object' && 'error' in error
        ? (error as any)
        : null;
      if (apiError) {
        mapApiErrorsToForm(apiError, form.setError);
      }
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: LoginFormSchema) => {
    try {
      await submit(values);
      const response = await login(values.email, values.password);
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
        router.push("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
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
      isLoading={isLoading}
      error={error?.message || null}
    />
  );
}

