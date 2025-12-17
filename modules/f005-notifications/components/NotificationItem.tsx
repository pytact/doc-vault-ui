/**
 * Notification Item Component
 * Pure UI component for individual notification row
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export interface NotificationItemProps {
  id: string;
  documentTitle: string;
  reminderTypeLabel: string; // "30 days", "7 days", "Expires today"
  expiryDateFormatted: string | null;
  createdAtRelative: string; // "2 hours ago"
  isRead: boolean;
  onMarkAsRead?: () => void;
  onClick?: () => void;
  className?: string;
}

/**
 * Notification item UI component
 * Pure presentation - no business logic
 */
export const NotificationItem = React.memo(function NotificationItem({
  id,
  documentTitle,
  reminderTypeLabel,
  expiryDateFormatted,
  createdAtRelative,
  isRead,
  onMarkAsRead,
  onClick,
  className,
}: NotificationItemProps) {
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleMarkAsRead = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onMarkAsRead) {
        onMarkAsRead();
      }
    },
    [onMarkAsRead]
  );

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors",
        !isRead && "bg-blue-50",
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Notification: ${documentTitle}`}
    >
      {/* Read/Unread Indicator */}
      <div className="flex-shrink-0 mt-1">
        {!isRead && (
          <div className="w-2 h-2 rounded-full bg-primary-600" aria-label="Unread notification" />
        )}
        {isRead && (
          <div className="w-2 h-2 rounded-full bg-gray-300" aria-label="Read notification" />
        )}
      </div>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-base font-medium truncate",
                !isRead ? "text-gray-900" : "text-gray-600"
              )}
            >
              {documentTitle}
            </h3>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <Badge variant="info" size="sm">
                {reminderTypeLabel}
              </Badge>
              {expiryDateFormatted && (
                <span className="text-sm text-gray-500">
                  Expires: {expiryDateFormatted}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{createdAtRelative}</p>
          </div>

          {/* Mark as Read Button */}
          {!isRead && onMarkAsRead && (
            <Button
              variant="subtle"
              size="sm"
              onClick={handleMarkAsRead}
              className="flex-shrink-0"
              aria-label="Mark as read"
            >
              Mark as Read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

