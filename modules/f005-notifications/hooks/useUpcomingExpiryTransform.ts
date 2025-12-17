/**
 * Upcoming Expiry Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for upcoming expiry widget display
 */

import { useMemo } from "react";
import { format } from "date-fns";
import { UpcomingExpiryItemResponse } from "../types/responses/notification";

interface TransformedExpiryItem extends UpcomingExpiryItemResponse {
  daysRemainingLabel: string; // "Expires in 7 days" or "Expires today"
  expiryDateFormatted: string; // "March 15, 2025"
  urgencyLevel: "critical" | "warning" | "normal"; // For styling
}

interface UseUpcomingExpiryTransformParams {
  expiries: UpcomingExpiryItemResponse[] | undefined;
}

interface UseUpcomingExpiryTransformReturn {
  transformedExpiries: TransformedExpiryItem[];
  criticalCount: number; // 0-3 days
  warningCount: number; // 4-7 days
  normalCount: number; // 8-30 days
}

/**
 * Format days until expiry to display label
 */
function formatDaysRemainingLabel(daysUntilExpiry: number): string {
  if (daysUntilExpiry === 0) {
    return "Expires today";
  } else if (daysUntilExpiry === 1) {
    return "Expires in 1 day";
  } else {
    return `Expires in ${daysUntilExpiry} days`;
  }
}

/**
 * Calculate urgency level based on days until expiry
 */
function getUrgencyLevel(daysUntilExpiry: number): "critical" | "warning" | "normal" {
  if (daysUntilExpiry <= 3) {
    return "critical";
  } else if (daysUntilExpiry <= 7) {
    return "warning";
  } else {
    return "normal";
  }
}

/**
 * Format expiry date to display format
 */
function formatExpiryDate(expiryDate: string): string {
  try {
    return format(new Date(expiryDate), "MMMM dd, yyyy");
  } catch (error) {
    return expiryDate;
  }
}

/**
 * Upcoming expiry transformation hook
 * Transforms upcoming expiry data with derived fields and formatting
 */
export function useUpcomingExpiryTransform(
  params: UseUpcomingExpiryTransformParams
): UseUpcomingExpiryTransformReturn {
  const { expiries = [] } = params;

  const transformedExpiries = useMemo(() => {
    return expiries.map((expiry) => {
      const daysRemainingLabel = formatDaysRemainingLabel(expiry.days_until_expiry);
      const expiryDateFormatted = formatExpiryDate(expiry.expiry_date);
      const urgencyLevel = getUrgencyLevel(expiry.days_until_expiry);

      return {
        ...expiry,
        daysRemainingLabel,
        expiryDateFormatted,
        urgencyLevel,
      };
    });
  }, [expiries]);

  const criticalCount = useMemo(() => {
    return transformedExpiries.filter((e) => e.urgencyLevel === "critical").length;
  }, [transformedExpiries]);

  const warningCount = useMemo(() => {
    return transformedExpiries.filter((e) => e.urgencyLevel === "warning").length;
  }, [transformedExpiries]);

  const normalCount = useMemo(() => {
    return transformedExpiries.filter((e) => e.urgencyLevel === "normal").length;
  }, [transformedExpiries]);

  return {
    transformedExpiries,
    criticalCount,
    warningCount,
    normalCount,
  };
}

