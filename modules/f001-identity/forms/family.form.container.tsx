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
import { useFamily } from "../hooks/useFamilies";
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
  const { data: familyData, isLoading: familyLoading, refetch: refetchFamily } = useFamily(familyId || null);
  const { submit, isLoading, error } = useFamilyFormSubmit(familyId);

  const form = useForm<FamilyFormSchema>({
    resolver: zodResolver(FamilySchema),
    defaultValues: getFamilyDefaultValues(familyData?.data?.data?.name),
    mode: "onChange",
  });

  // Update form when family data loads
  useEffect(() => {
    if (familyData?.data?.data?.name) {
      form.reset(getFamilyDefaultValues(familyData.data.data.name));
    }
  }, [familyData, form]);

  // Map API errors to form fields
  useEffect(() => {
    if (error && typeof error === 'object' && 'error' in error) {
      mapApiErrorsToForm(error as any, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (values: FamilyFormSchema) => {
    console.log("FamilyFormContainer.handleSubmit - Called with values:", values, "familyId:", familyId);
    console.log("FamilyFormContainer - Family data:", familyData);
    console.log("FamilyFormContainer - ETag:", familyData?.etag);
    console.log("FamilyFormContainer - Family loading:", familyLoading);
    
    // For update operations, ensure we have family data and ETag
    if (familyId) {
      if (familyLoading) {
        console.error("FamilyFormContainer - Family data still loading");
        addNotification({
          type: "error",
          message: "Please wait for family data to load before updating.",
          title: "Update Failed",
        });
        return;
      }
      
      // Refetch to get the latest ETag before update
      console.log("FamilyFormContainer - Refetching family data to get latest ETag before update...");
      try {
        const freshData = await refetchFamily();
        console.log("FamilyFormContainer - Fresh ETag:", freshData.data?.etag);
        
        if (!freshData.data?.etag) {
          console.error("FamilyFormContainer - ETag missing after refetch");
          addNotification({
            type: "error",
            message: "ETag is required for update operations. Please refresh the page and try again.",
            title: "Update Failed",
          });
          return;
        }
      } catch (refetchError) {
        console.error("FamilyFormContainer - Error refetching family data:", refetchError);
        // Continue with existing ETag if refetch fails
      }
    }
    
    try {
      const result = await submit(values);
      console.log("Family form submit result:", result);
      addNotification({
        type: "success",
        message: familyId
          ? "Family updated successfully"
          : "Family created successfully",
        title: "Success",
      });
      form.reset();
      // Call onSuccess after a small delay to ensure notification is shown
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    } catch (err: any) {
      console.error("Family form submit error:", err);
      
      // Check if it's a PRECONDITION_FAILED error (ETag mismatch)
      if (err?.error?.code === "PRECONDITION_FAILED" || 
          err?.response?.data?.error?.code === "PRECONDITION_FAILED") {
        addNotification({
          type: "error",
          message: "The family was modified by another user. Please refresh the page and try again.",
          title: "Resource Modified",
        });
        // Refetch to update the form with latest data
        await refetchFamily();
      } else {
      const errorMessage =
        err instanceof Error
          ? err.message
            : err?.error?.message || err?.response?.data?.message || (familyId
            ? "Failed to update family. Please try again."
              : "Failed to create family. Please try again.");
      addNotification({
        type: "error",
        message: errorMessage,
        title: familyId ? "Update Failed" : "Creation Failed",
      });
      }
      // Don't call onSuccess on error
    }
  };

  return (
    <div className={familyId ? "" : "max-w-2xl"}>
    <FamilyForm
        initialName={familyData?.data?.data?.name}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
        showCard={!familyId} // Don't show card when editing (in modal), show card when creating (on page)
        form={form} // Pass form instance to connect error handling and state
    />
    </div>
  );
}

