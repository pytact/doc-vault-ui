/**
 * Notification List Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for notification list display
 */

import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { NotificationResponse } from "../types/responses/notification";

interface TransformedNotificationItem extends NotificationResponse {
  reminderTypeLabel: string; // "30 days", "7 days", "Expires today"
  expiryDateFormatted: string | null; // "March 15, 2025"
  createdAtRelative: string; // "2 hours ago"
  createdAtFormatted: string; // "Jan 20, 2024 10:30 AM"
}

interface UseNotificationListTransformParams {
  notifications: NotificationResponse[] | undefined;
}

interface UseNotificationListTransformReturn {
  transformedNotifications: TransformedNotificationItem[];
  unreadCount: number;
  readCount: number;
  hasUnread: boolean;
}

/**
 * Format reminder type to display label
 */
function formatReminderTypeLabel(reminderType: "30d" | "7d" | "0d"): string {
  switch (reminderType) {
    case "30d":
      return "30 days";
    case "7d":
      return "7 days";
    case "0d":
      return "Expires today";
    default:
      return reminderType;
  }
}

/**
 * Format expiry date to display format
 */
function formatExpiryDate(expiryDate: string | null): string | null {
  if (!expiryDate) return null;
  try {
    return format(new Date(expiryDate), "MMMM dd, yyyy");
  } catch (error) {
    return expiryDate;
  }
}

/**
 * Format created_at to relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(createdAt: string): string {
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch (error) {
    return createdAt;
  }
}

/**
 * Format created_at to absolute time (e.g., "Jan 20, 2024 10:30 AM")
 */
function formatAbsoluteTime(createdAt: string): string {
  try {
    return format(new Date(createdAt), "MMM dd, yyyy h:mm a");
  } catch (error) {
    return createdAt;
  }
}

/**
 * Notification list transformation hook
 * Transforms notification list data with derived fields and formatting
 */
export function useNotificationListTransform(
  params: UseNotificationListTransformParams
): UseNotificationListTransformReturn {
  const { notifications = [] } = params;

  const transformedNotifications = useMemo(() => {
    return notifications.map((notification) => {
      const reminderTypeLabel = formatReminderTypeLabel(notification.reminder_type);
      const expiryDateFormatted = formatExpiryDate(notification.expiry_date);
      const createdAtRelative = formatRelativeTime(notification.created_at);
      const createdAtFormatted = formatAbsoluteTime(notification.created_at);

      return {
        ...notification,
        reminderTypeLabel,
        expiryDateFormatted,
        createdAtRelative,
        createdAtFormatted,
      };
    });
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return transformedNotifications.filter((n) => !n.is_read).length;
  }, [transformedNotifications]);

  const readCount = useMemo(() => {
    return transformedNotifications.filter((n) => n.is_read).length;
  }, [transformedNotifications]);

  const hasUnread = useMemo(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  return {
    transformedNotifications,
    unreadCount,
    readCount,
    hasUnread,
  };
}

