/**
 * Notification Center Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NotificationCenter } from "../components/NotificationCenter";
import { useListNotifications } from "../hooks/useNotifications";
import { useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "../hooks/useNotifications";
import { useExpiryNotificationContext } from "@/contexts/expiry-notification.context";
import { useNotificationListTransform } from "../hooks/useNotificationListTransform";
import { documentRoutes } from "@/utils/routing";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Convert updated_at timestamp to ETag format
 * Format: YYYYMMDDTHHMMSSZ
 */
function convertUpdatedAtToETag(updatedAt: string): string {
  try {
    const date = new Date(updatedAt);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  } catch (error) {
    return "";
  }
}

/**
 * Notification center container component
 * Handles business logic and API calls via hooks
 */
export function NotificationCenterContainer() {
  const router = useRouter();
  const { listFilters, setUnreadCount } = useExpiryNotificationContext();

  // Get notification list with filters from context
  const queryParams = useMemo(() => {
    return listFilters || undefined;
  }, [listFilters]);

  const { data: notificationsData, isLoading, error, refetch } = useListNotifications(queryParams);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  // Transform notifications for display
  const { transformedNotifications, unreadCount, hasUnread } = useNotificationListTransform({
    notifications: notificationsData?.data?.items,
  });

  // Update unread count in context
  useEffect(() => {
    setUnreadCount(unreadCount);
  }, [unreadCount, setUnreadCount]);

  const handleNotificationClick = useCallback(
    (notificationId: string, documentId: string) => {
      // Mark as read when clicked (if not already read)
      const notification = transformedNotifications.find((n) => n.id === notificationId);
      if (notification && !notification.is_read) {
        // Derive ETag from notification's updated_at
        const etag = convertUpdatedAtToETag(notification.updated_at);
        if (etag) {
          markAsReadMutation.mutate(
            { notificationId, etag },
            {
              onSuccess: () => {
                // Navigate to document detail after marking as read
                router.push(documentRoutes.detail(documentId));
              },
              onError: () => {
                // Navigate even if mark as read fails
                router.push(documentRoutes.detail(documentId));
              },
            }
          );
        } else {
          // Navigate directly if ETag derivation fails
          router.push(documentRoutes.detail(documentId));
        }
      } else {
        // Navigate directly if already read
        router.push(documentRoutes.detail(documentId));
      }
    },
    [transformedNotifications, markAsReadMutation, router]
  );

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      // Find notification and derive ETag from updated_at
      const notification = transformedNotifications.find((n) => n.id === notificationId);
      if (notification) {
        const etag = convertUpdatedAtToETag(notification.updated_at);
        if (etag) {
          markAsReadMutation.mutate({ notificationId, etag });
        }
      }
    },
    [transformedNotifications, markAsReadMutation]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Failed to load notifications
            </p>
            <p className="mt-2 text-gray-600">
              {error?.message || "An error occurred while loading notifications."}
            </p>
            <Button
              onClick={handleRetry}
              variant="primary"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Prepare notification items with handlers
  const notificationItems = useMemo(() => {
    return transformedNotifications.map((notification) => ({
      id: notification.id,
      documentTitle: notification.document_title,
      reminderTypeLabel: notification.reminderTypeLabel,
      expiryDateFormatted: notification.expiryDateFormatted,
      createdAtRelative: notification.createdAtRelative,
      isRead: notification.is_read,
      onMarkAsRead: () => {
        handleMarkAsRead(notification.id);
      },
      onClick: () => {
        handleNotificationClick(notification.id, notification.document_id);
      },
    }));
  }, [transformedNotifications, handleNotificationClick, handleMarkAsRead]);

  return (
    <NotificationCenter
      notifications={notificationItems}
      hasUnread={hasUnread}
      onMarkAllAsRead={handleMarkAllAsRead}
      isLoading={isLoading}
    />
  );
}

