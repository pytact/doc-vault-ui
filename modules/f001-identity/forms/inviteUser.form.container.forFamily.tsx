/**
 * Invite User Form Container Component for SuperAdmin inviting users to a specific family
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
import { useInviteUser } from "../hooks/useUsers";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import { useRoleList } from "@/hooks/useRoles";

interface InviteUserFormContainerForFamilyProps {
  familyId: string;
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * Invite user form container component for SuperAdmin
 * Handles business logic, API calls, and error mapping
 */
export function InviteUserFormContainerForFamily({
  familyId,
  onSuccess,
  onCancel,
}: InviteUserFormContainerForFamilyProps) {
  const { addNotification } = useNotificationContext();
  const inviteMutation = useInviteUser();
  const { data: rolesData } = useRoleList();

  const form = useForm<InviteUserFormSchema>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: inviteUserDefaultValues,
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (inviteMutation.error) {
      mapApiErrorsToForm(inviteMutation.error, form.setError);
    }
  }, [inviteMutation.error, form.setError]);

  const handleSubmit = async (values: InviteUserFormSchema) => {
    try {
      console.log("InviteUserFormContainerForFamily - Submitting invite with values:", values);
      console.log("InviteUserFormContainerForFamily - Role ID:", values.role_id);
      await inviteMutation.mutateAsync({
        familyId,
        payload: values, // This includes email and role_id
      });
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
      isLoading={inviteMutation.isPending}
      availableRoles={availableRoles}
    />
  );
}

