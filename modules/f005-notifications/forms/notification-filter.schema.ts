/**
 * Notification Filter Form Schema
 * Zod validation schema for notification filter form
 * Based on R10 rules
 */

import { z } from "zod";

/**
 * Notification Filter Schema
 * Validates notification filter form data
 * Used for filtering notifications by reminder type, read status, and date range
 */
export const NotificationFilterSchema = z.object({
  reminder_type: z
    .enum(["30d", "7d", "0d", "all"], {
      errorMap: () => ({ message: "Invalid reminder type" }),
    })
    .optional()
    .nullable(),
  is_read: z
    .enum(["read", "unread", "all"], {
      errorMap: () => ({ message: "Invalid read status" }),
    })
    .optional()
    .nullable(),
  date_from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  date_to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  sort_by: z
    .enum(["created_at"], {
      errorMap: () => ({ message: "Invalid sort field" }),
    })
    .optional()
    .nullable(),
  sort_order: z
    .enum(["asc", "desc"], {
      errorMap: () => ({ message: "Invalid sort order" }),
    })
    .optional()
    .nullable(),
}).refine(
  (data) => {
    // If date_from is provided, date_to must also be provided
    if (data.date_from && !data.date_to) {
      return false;
    }
    // If date_to is provided, date_from must also be provided
    if (data.date_to && !data.date_from) {
      return false;
    }
    // If both dates are provided, date_from must be before or equal to date_to
    if (data.date_from && data.date_to) {
      const from = new Date(data.date_from);
      const to = new Date(data.date_to);
      return from <= to;
    }
    return true;
  },
  {
    message: "Date range is invalid. Start date must be before or equal to end date.",
    path: ["date_to"],
  }
);

export type NotificationFilterFormSchema = z.infer<typeof NotificationFilterSchema>;

/**
 * Default values for notification filter form
 */
export const notificationFilterDefaultValues: NotificationFilterFormSchema = {
  reminder_type: "all",
  is_read: "all",
  date_from: null,
  date_to: null,
  sort_by: "created_at",
  sort_order: "desc",
};

/**
 * Get default values for notification filter form
 * Can be populated from existing filter state
 */
export function getNotificationFilterDefaultValues(
  filters?: {
    reminder_type?: "30d" | "7d" | "0d" | "all" | null;
    is_read?: "read" | "unread" | "all" | null;
    date_from?: string | null;
    date_to?: string | null;
    sort_by?: "created_at" | null;
    sort_order?: "asc" | "desc" | null;
  } | null
): NotificationFilterFormSchema {
  return {
    reminder_type: filters?.reminder_type ?? "all",
    is_read: filters?.is_read ?? "all",
    date_from: filters?.date_from ?? null,
    date_to: filters?.date_to ?? null,
    sort_by: filters?.sort_by ?? "created_at",
    sort_order: filters?.sort_order ?? "desc",
  };
}

