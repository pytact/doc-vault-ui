/**
 * Notification Center Component
 * SCR_NOTIFICATION_CENTER - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationItem, NotificationItemProps } from "./NotificationItem";

export interface NotificationCenterProps {
  notifications: Array<
    NotificationItemProps & {
      id: string;
    }
  >;
  hasUnread: boolean;
  onMarkAllAsRead?: () => void;
  isLoading?: boolean;
}

/**
 * Notification Center UI component
 * Pure presentation - no business logic
 */
export const NotificationCenter = React.memo(function NotificationCenter({
  notifications,
  hasUnread,
  onMarkAllAsRead,
  isLoading = false,
}: NotificationCenterProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading notifications...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-600">
              {notifications.length === 0
                ? "No notifications"
                : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          {hasUnread && onMarkAllAsRead && (
            <Button
              variant="outline"
              onClick={onMarkAllAsRead}
              aria-label="Mark all notifications as read"
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="p-0">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base">You have no notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
});

