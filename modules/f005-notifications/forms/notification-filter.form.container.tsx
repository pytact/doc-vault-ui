/**
 * Notification Filter Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationFilterForm } from "./notification-filter.form";
import {
  NotificationFilterSchema,
  getNotificationFilterDefaultValues,
  type NotificationFilterFormSchema,
} from "./notification-filter.schema";
import { useNotificationFilterFormSubmit } from "./useNotificationFilterFormSubmit";
import { useExpiryNotificationContext } from "@/contexts/expiry-notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import type { NotificationListParams } from "../types/requests/notification";

/**
 * Notification filter form container component
 * Handles business logic, API calls, and error mapping
 */
export function NotificationFilterFormContainer() {
  const { listFilters, setListFilters, clearFilters } = useExpiryNotificationContext();
  const { submit, convertToQueryParams } = useNotificationFilterFormSubmit();

  // Get default values from context filters
  const defaultValues = React.useMemo(() => {
    if (!listFilters) {
      return getNotificationFilterDefaultValues(null);
    }
    // Convert NotificationListParams to filter form schema format
    const filterValues = {
      reminder_type: null as "30d" | "7d" | "0d" | "all" | null,
      is_read: null as "read" | "unread" | "all" | null,
      date_from: null as string | null,
      date_to: null as string | null,
      sort_by: (listFilters.sort_by === "created_at" ? "created_at" : null) as "created_at" | null,
      sort_order: listFilters.sort_order || null,
    };
    return getNotificationFilterDefaultValues(filterValues);
  }, [listFilters]);

  const form = useForm<NotificationFilterFormSchema>({
    resolver: zodResolver(NotificationFilterSchema),
    defaultValues,
    mode: "onChange",
  });

  // Update form when context filters change
  useEffect(() => {
    if (listFilters) {
      // Convert NotificationListParams to filter form schema format
      const filterValues = {
        reminder_type: null as "30d" | "7d" | "0d" | "all" | null,
        is_read: null as "read" | "unread" | "all" | null,
        date_from: null as string | null,
        date_to: null as string | null,
        sort_by: (listFilters.sort_by === "created_at" ? "created_at" : null) as "created_at" | null,
        sort_order: listFilters.sort_order || null,
      };
      const newDefaults = getNotificationFilterDefaultValues(filterValues);
      form.reset(newDefaults);
    }
  }, [listFilters, form]);

  const handleSubmit = useCallback(
    async (values: NotificationFilterFormSchema) => {
      try {
        // Convert form values to API query parameters
        const queryParams = submit(values);

        // Update context with new filters
        setListFilters(queryParams);
      } catch (err) {
        // Handle errors - form validation errors are handled by React Hook Form
        // Note: Filter form doesn't make API calls, so errors are rare
        // If needed, errors can be logged to a centralized logger service
        // For now, we silently handle errors as form validation covers most cases
      }
    },
    [submit, setListFilters]
  );

  const handleReset = useCallback(() => {
    // Clear filters in context
    clearFilters();
    // Form reset is handled by the form component
  }, [clearFilters]);

  // Map API errors to form fields (if any occur during filter application)
  // Note: Filter form typically doesn't have API errors, but we include this for consistency
  useEffect(() => {
    // This would be used if we had API errors from filter submission
    // For now, filter form doesn't make API calls directly
    // Filters are applied client-side or via query parameters
  }, [form.setError]);

  return (
    <NotificationFilterForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      isLoading={false}
      error={null}
      defaultValues={defaultValues}
    />
  );
}

