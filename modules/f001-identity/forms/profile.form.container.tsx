/**
 * Profile Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileForm } from "./profile.form";
import { ProfileSchema, getProfileDefaultValues, type ProfileFormSchema } from "./profile.schema";
import { useProfileFormSubmit } from "./useProfileFormSubmit";
import { useProfile } from "../hooks/useProfile";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";

interface ProfileFormContainerProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Profile form container component
 * Handles business logic, API calls, and error mapping
 */
export function ProfileFormContainer({ onSuccess, onCancel }: ProfileFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { submit, isLoading, error } = useProfileFormSubmit();
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: getProfileDefaultValues(profileData?.data?.data?.name),
    mode: "onChange",
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profileData?.data?.data?.name) {
      form.reset(getProfileDefaultValues(profileData.data.data.name));
    }
  }, [profileData, form]);

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
      setSuccess(null);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: ProfileFormSchema) => {
    try {
      await submit(values);
      setSuccess("Profile updated successfully");
      addNotification({
        type: "success",
        message: "Profile updated successfully",
        title: "Success",
      });
      form.reset();
      // Call onSuccess after a small delay to ensure notification is shown
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Update Failed",
      });
      setSuccess(null);
    }
  };

  if (profileLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData?.data?.data) {
    return <div>Profile not found</div>;
  }

  return (
    <ProfileForm
      initialName={profileData.data.data.name}
      email={profileData.data.data.email}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      error={error?.message || null}
      success={success}
    />
  );
}

