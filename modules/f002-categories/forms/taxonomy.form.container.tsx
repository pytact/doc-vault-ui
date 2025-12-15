/**
 * Taxonomy Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useNotificationContext } from "@/contexts/notification.context";
import { useTaxonomyForm } from "./useTaxonomyForm";
import { TaxonomyForm } from "./taxonomy.form";
import { useTaxonomyFormSubmit } from "./useTaxonomyFormSubmit";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import type { TaxonomySelectionFormSchema } from "./taxonomy.schema";
import type { APIErrorResponse } from "@/types/responses/common";

interface TaxonomyFormContainerProps {
  /**
   * Initial category ID (for edit mode)
   */
  initialCategoryId?: string | null;

  /**
   * Initial subcategory ID (for edit mode)
   */
  initialSubcategoryId?: string | null;

  /**
   * Success callback
   */
  onSuccess?: (values: TaxonomySelectionFormSchema) => void;

  /**
   * Cancel callback
   */
  onCancel?: () => void;

  /**
   * Submit button label
   */
  submitLabel?: string;

  /**
   * Cancel button label
   */
  cancelLabel?: string;

  /**
   * Show cancel button
   */
  showCancel?: boolean;
}

/**
 * Taxonomy form container component
 * Handles business logic, validation, and error mapping
 * 
 * NOTE: F-002 is read-only (immutable taxonomy).
 * This form is for selecting taxonomy values (e.g., when creating/editing documents).
 */
export function TaxonomyFormContainer({
  initialCategoryId,
  initialSubcategoryId,
  onSuccess,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  showCancel = false,
}: TaxonomyFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const { submit, isLoading, error } = useTaxonomyFormSubmit();

  const form = useTaxonomyForm({
    defaultValues: {
      category_id: initialCategoryId || "",
      subcategory_id: initialSubcategoryId || "",
    },
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      // Check if error is APIErrorResponse format
      if (
        error &&
        typeof error === "object" &&
        "error" in error &&
        error.error &&
        typeof error.error === "object" &&
        "details" in error.error
      ) {
        // Type guard for APIErrorResponse
        mapApiErrorsToForm(error as APIErrorResponse, form.setError);
      } else {
        // Handle generic errors
        addNotification({
          type: "error",
          message: error.message || "An error occurred",
          title: "Error",
        });
      }
    }
  }, [error, form.setError, addNotification]);

  const handleSubmit = async (values: TaxonomySelectionFormSchema) => {
    try {
      const result = await submit(values);
      addNotification({
        type: "success",
        message: "Taxonomy selection saved successfully",
        title: "Success",
      });
      form.reset();
      onSuccess?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save taxonomy selection. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Save Failed",
      });
    }
  };

  return (
    <TaxonomyForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      submitLabel={submitLabel}
      cancelLabel={cancelLabel}
      showCancel={showCancel}
    />
  );
}

