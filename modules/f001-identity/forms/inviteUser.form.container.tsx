/**
 * Invite User Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteUserForm } from "./inviteUser.form";
import {
  InviteUserSchema,
  inviteUserDefaultValues,
  type InviteUserFormSchema,
} from "./inviteUser.schema";
import { useInviteUserFormSubmit } from "./useInviteUserFormSubmit";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import { useModalState } from "@/hooks/useModalState";
import { useRoleList } from "@/hooks/useRoles";

interface InviteUserFormContainerProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * Invite user form container component
 * Handles business logic, API calls, and error mapping
 */
export function InviteUserFormContainer({
  onSuccess,
  onCancel,
}: InviteUserFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const { submit, isLoading, error } = useInviteUserFormSubmit();
  const { data: rolesData } = useRoleList();

  const form = useForm<InviteUserFormSchema>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: inviteUserDefaultValues,
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: InviteUserFormSchema) => {
    try {
      await submit(values);
      addNotification({
        type: "success",
        message: "Invitation sent successfully",
        title: "Invitation Sent",
      });
      form.reset();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send invitation. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Invitation Failed",
      });
    }
  };

  const availableRoles = rolesData?.data?.items || [];

  return (
    <InviteUserForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      availableRoles={availableRoles}
    />
  );
}

