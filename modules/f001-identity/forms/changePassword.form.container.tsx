/**
 * Change Password Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordForm } from "./changePassword.form";
import {
  createChangePasswordSchema,
  changePasswordDefaultValues,
  type ChangePasswordFormSchema,
} from "./changePassword.schema";
import { useChangePasswordFormSubmit } from "./useChangePasswordFormSubmit";
import { useProfile } from "../hooks/useProfile";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";

interface ChangePasswordFormContainerProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * Change password form container component
 * Handles business logic, API calls, and error mapping
 */
export function ChangePasswordFormContainer({
  onSuccess,
  onCancel,
}: ChangePasswordFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const { data: profileData } = useProfile();
  const { submit, isLoading, error } = useChangePasswordFormSubmit();

  const schema = createChangePasswordSchema(profileData?.data?.data?.password_rules || undefined);
  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: changePasswordDefaultValues,
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: ChangePasswordFormSchema) => {
    try {
      await submit(values);
      addNotification({
        type: "success",
        message: "Password changed successfully",
        title: "Success",
      });
      form.reset();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to change password. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Password Change Failed",
      });
    }
  };

  return (
    <ChangePasswordForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      error={error?.message || null}
      passwordRules={profileData?.data?.data?.password_rules || undefined}
    />
  );
}

