/**
 * Notification Filter Form Submit Hook
 * Custom hook for notification filter form submission
 * Based on R10 rules
 */

import { useCallback } from "react";
import type { NotificationFilterFormSchema } from "./notification-filter.schema";
import type { NotificationListParams } from "../types/requests/notification";

/**
 * Notification filter form submit hook
 * Handles notification filter form submission logic
 * Converts form values to API query parameters
 */
export function useNotificationFilterFormSubmit() {
  /**
   * Convert form values to API query parameters
   */
  const convertToQueryParams = useCallback(
    (values: NotificationFilterFormSchema): NotificationListParams => {
      const params: NotificationListParams = {};

      // Convert reminder_type filter (if not "all")
      if (values.reminder_type && values.reminder_type !== "all") {
        // Note: API doesn't support reminder_type filter directly
        // This would need to be handled client-side or via a new API endpoint
        // For now, we'll skip this filter
      }

      // Convert is_read filter (if not "all")
      if (values.is_read && values.is_read !== "all") {
        // Note: API doesn't support is_read filter directly
        // This would need to be handled client-side or via a new API endpoint
        // For now, we'll skip this filter
      }

      // Convert date filters
      // Note: API doesn't support date range filters directly
      // This would need to be handled client-side or via a new API endpoint
      // For now, we'll skip these filters

      // Convert sort parameters
      if (values.sort_by) {
        params.sort_by = values.sort_by;
      }
      if (values.sort_order) {
        params.sort_order = values.sort_order;
      }

      // Set default pagination if not provided
      params.page = 1;
      params.page_size = 20;

      return params;
    },
    []
  );

  /**
   * Submit filter form
   * Converts form values to API query parameters
   */
  const submit = useCallback(
    (values: NotificationFilterFormSchema): NotificationListParams => {
      return convertToQueryParams(values);
    },
    [convertToQueryParams]
  );

  return {
    submit,
    convertToQueryParams,
  };
}

