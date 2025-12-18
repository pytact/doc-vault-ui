/**
 * User Reassignment Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { UserReassignmentForm } from "./userReassignment.form";
import {
  UserReassignmentSchema,
  getUserReassignmentDefaultValues,
  type UserReassignmentFormSchema,
} from "./userReassignment.schema";
import { useUserReassignmentFormSubmit } from "./useUserReassignmentFormSubmit";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "@/modules/f001-identity/forms/utils/errorMapper";
import type { APIErrorResponse } from "@/types/responses/common.responses";
import type { FamilyResponse } from "../types/responses/family";
import type { UserResponse } from "../types/responses/user";

interface UserReassignmentFormContainerProps {
  userId: string;
  etag: string;
  user: UserResponse | null;
  availableFamilies: FamilyResponse[];
  availableRoles: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * User reassignment form container component
 * Handles business logic, API calls, and error mapping
 */
export function UserReassignmentFormContainer({
  userId,
  etag,
  user,
  availableFamilies,
  availableRoles,
  onSuccess,
  onCancel,
}: UserReassignmentFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const queryClient = useQueryClient();
  const { submit, isLoading, error } = useUserReassignmentFormSubmit({
    userId,
    etag,
  });

  // Filter out soft-deleted families and current family
  const filteredFamilies = useMemo(() => {
    if (!user) return availableFamilies;

    return availableFamilies.filter(
      (family) =>
        family.status === "Active" &&
        family.id !== user.family_id &&
        !family.is_del
    );
  }, [availableFamilies, user]);

  // Filter out superadmin role (SuperAdmin cannot assign superadmin to others)
  const filteredRoles = useMemo(() => {
    return availableRoles.filter(
      (role) => role.name.toLowerCase() !== "superadmin"
    );
  }, [availableRoles]);

  // Build select options
  const familyOptions = useMemo(() => {
    return filteredFamilies.map((family) => ({
      value: family.id,
      label: family.name,
      disabled: false,
    }));
  }, [filteredFamilies]);

  const roleOptions = useMemo(() => {
    return filteredRoles.map((role) => ({
      value: role.id,
      label: role.name,
      disabled: false,
    }));
  }, [filteredRoles]);

  const form = useForm<UserReassignmentFormSchema>({
    resolver: zodResolver(UserReassignmentSchema),
    defaultValues: getUserReassignmentDefaultValues(),
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error && typeof error === "object" && "error" in error) {
      mapApiErrorsToForm(error as APIErrorResponse, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: UserReassignmentFormSchema) => {
    // Additional validation: check if reassigning to same family
    if (user && values.family_id === user.family_id) {
      form.setError("family_id", {
        message: "User is already in this family",
      });
      return;
    }

    // Check if target family is soft-deleted
    const targetFamily = availableFamilies.find(
      (f) => f.id === values.family_id
    );
    if (
      targetFamily &&
      (targetFamily.is_del || targetFamily.status === "SoftDeleted")
    ) {
      form.setError("family_id", {
        message: "Cannot reassign user to a soft-deleted family",
      });
      return;
    }

    // Check if user's current family is soft-deleted
    if (user) {
      const currentFamily = availableFamilies.find(
        (f) => f.id === user.family_id
      );
      if (
        currentFamily &&
        (currentFamily.is_del || currentFamily.status === "SoftDeleted")
      ) {
        form.setError("family_id", {
          message: "Cannot reassign user from a soft-deleted family",
        });
        return;
      }
    }

    try {
      await submit(values);
      addNotification({
        type: "success",
        message: "User reassigned successfully",
        title: "Success",
      });
      form.reset();
      // Call onSuccess after a small delay to ensure notification is shown
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    } catch (err: unknown) {
      // Check if it's a PRECONDITION_FAILED error (ETag mismatch)
      const apiError = err as APIErrorResponse | { response?: { data?: APIErrorResponse } };
      const errorCode =
        (apiError as APIErrorResponse)?.error?.code ||
        (apiError as { response?: { data?: APIErrorResponse } })?.response?.data?.error?.code;

      if (errorCode === "PRECONDITION_FAILED") {
        addNotification({
          type: "error",
          message:
            "The user was modified by another user. Please refresh the page and try again.",
          title: "Resource Modified",
        });
        // Invalidate query to trigger refetch on next access
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        const errorMessage =
          err instanceof Error
            ? err.message
            : (apiError as APIErrorResponse)?.error?.message ||
              (apiError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              "Failed to reassign user. Please try again.";
        addNotification({
          type: "error",
          message: errorMessage,
          title: "Reassignment Failed",
        });
      }
      // Don't call onSuccess on error
    }
  };

  return (
    <UserReassignmentForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      familyOptions={familyOptions}
      roleOptions={roleOptions}
      currentFamilyId={user?.family_id}
    />
  );
}

