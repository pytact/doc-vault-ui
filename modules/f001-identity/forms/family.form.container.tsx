/**
 * Family Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FamilyForm } from "./family.form";
import {
  FamilySchema,
  getFamilyDefaultValues,
  type FamilyFormSchema,
} from "./family.schema";
import { useFamilyFormSubmit } from "./useFamilyFormSubmit";
import { useFamily } from "@/hooks/useFamilies";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";

interface FamilyFormContainerProps {
  familyId?: string;
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * Family form container component
 * Handles business logic, API calls, and error mapping
 */
export function FamilyFormContainer({
  familyId,
  onSuccess,
  onCancel,
}: FamilyFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const { data: familyData } = useFamily(familyId || null);
  const { submit, isLoading, error } = useFamilyFormSubmit(familyId);

  const form = useForm<FamilyFormSchema>({
    resolver: zodResolver(FamilySchema),
    defaultValues: getFamilyDefaultValues(familyData?.data?.name),
    mode: "onChange",
  });

  // Update form when family data loads
  useEffect(() => {
    if (familyData?.data?.name) {
      form.reset(getFamilyDefaultValues(familyData.data.name));
    }
  }, [familyData, form]);

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: FamilyFormSchema) => {
    try {
      await submit(values);
      addNotification({
        type: "success",
        message: familyId
          ? "Family updated successfully"
          : "Family created successfully",
        title: "Success",
      });
      form.reset();
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : familyId
            ? "Failed to update family. Please try again."
            : "Failed to create family. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: familyId ? "Update Failed" : "Creation Failed",
      });
    }
  };

  return (
    <FamilyForm
      initialName={familyData?.data?.name}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}

