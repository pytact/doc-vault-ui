/**
 * Notification Detail Redirect Component
 * SCR_NOTIFICATION_DETAIL (Virtual Screen) - Auto-redirect component
 * Based on R7 rules
 * 
 * This is a virtual screen that:
 * 1. Auto-marks notification as read
 * 2. Redirects to document detail page
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMarkNotificationAsRead } from "../hooks/useNotifications";
import { useListNotifications } from "../hooks/useNotifications";
import { documentRoutes } from "@/utils/routing";
import { Card, CardBody } from "@/components/ui/card";

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
 * Notification Detail Redirect Container Component
 * Handles auto-mark-as-read and redirect logic
 */
export function NotificationDetailRedirect() {
  const router = useRouter();
  const params = useParams();
  const notificationId = params?.id as string | undefined;

  const { data: notificationsData } = useListNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  useEffect(() => {
    if (!notificationId) {
      // Invalid notification ID, redirect to notifications list
      router.push("/notifications");
      return;
    }

    // Find the notification in the list to get document_id and etag
    const notification = notificationsData?.data?.items?.find(
      (n) => n.id === notificationId
    );

    if (!notification) {
      // Notification not found, redirect to notifications list
      router.push("/notifications");
      return;
    }

    // Auto-mark notification as read
    // Derive ETag from notification's updated_at
    const etag = convertUpdatedAtToETag(notification.updated_at);
    if (etag) {
      markAsReadMutation.mutate(
        { notificationId, etag },
        {
          onSuccess: () => {
            // Redirect to document detail after marking as read
            router.push(documentRoutes.detail(notification.document_id));
          },
          onError: () => {
            // Redirect even if mark as read fails
            router.push(documentRoutes.detail(notification.document_id));
          },
        }
      );
    } else {
      // Redirect directly if ETag derivation fails
      router.push(documentRoutes.detail(notification.document_id));
    }
  }, [notificationId, notificationsData, markAsReadMutation, router]);

  // Show minimal loading state while processing
  return (
    <Card>
      <CardBody>
        <div className="text-center py-8 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4">Redirecting to document...</p>
        </div>
      </CardBody>
    </Card>
  );
}

