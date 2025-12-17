/**
 * Expiry Item Component
 * Pure UI component for individual expiry row in dashboard widget
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

export interface ExpiryItemProps {
  documentId: string;
  documentTitle: string;
  daysRemainingLabel: string; // "Expires in 7 days" or "Expires today"
  expiryDateFormatted: string; // "March 15, 2025"
  category?: string;
  subcategory?: string;
  urgencyLevel: "critical" | "warning" | "normal";
  onClick?: () => void;
  className?: string;
}

/**
 * Expiry item UI component
 * Pure presentation - no business logic
 */
export const ExpiryItem = React.memo(function ExpiryItem({
  documentId,
  documentTitle,
  daysRemainingLabel,
  expiryDateFormatted,
  category,
  subcategory,
  urgencyLevel,
  onClick,
  className,
}: ExpiryItemProps) {
  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // Urgency badge variant mapping
  const urgencyBadgeVariant = React.useMemo(() => {
    switch (urgencyLevel) {
      case "critical":
        return "danger";
      case "warning":
        return "warning";
      case "normal":
        return "info";
      default:
        return "info";
    }
  }, [urgencyLevel]);

  // Urgency text color
  const urgencyTextColor = React.useMemo(() => {
    switch (urgencyLevel) {
      case "critical":
        return "text-danger-600";
      case "warning":
        return "text-warning-600";
      case "normal":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  }, [urgencyLevel]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer",
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
      aria-label={`Expiring document: ${documentTitle}`}
    >
      {/* Urgency Indicator */}
      <div className="flex-shrink-0 mt-1">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            urgencyLevel === "critical" && "bg-danger-600",
            urgencyLevel === "warning" && "bg-warning-600",
            urgencyLevel === "normal" && "bg-info-600"
          )}
          aria-label={`${urgencyLevel} urgency`}
        />
      </div>

      {/* Expiry Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {documentTitle}
            </h3>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <Badge variant={urgencyBadgeVariant} size="sm">
                {daysRemainingLabel}
              </Badge>
              <span className={cn("text-xs font-medium", urgencyTextColor)}>
                {expiryDateFormatted}
              </span>
            </div>
            {(category || subcategory) && (
              <p className="mt-1 text-xs text-gray-500">
                {category}
                {category && subcategory && " / "}
                {subcategory}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

