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
import { dashboardRoutes } from "@/utils/routing";

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
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: LoginFormSchema) => {
    try {
      await submit(values);
      await login(values.email, values.password);
      addNotification({
        type: "success",
        message: "Login successful",
        title: "Welcome back!",
      });
      router.push(dashboardRoutes.home);
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

