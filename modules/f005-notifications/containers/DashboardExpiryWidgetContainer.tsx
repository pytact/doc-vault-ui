/**
 * Dashboard Expiry Widget Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardExpiryWidget } from "../components/DashboardExpiryWidget";
import { useGetUpcomingExpiries } from "../hooks/useNotifications";
import { useUpcomingExpiryTransform } from "../hooks/useUpcomingExpiryTransform";
import { useAuthContext } from "@/contexts/auth.context";
import { documentRoutes } from "@/utils/routing";

/**
 * Dashboard expiry widget container component
 * Handles business logic and API calls via hooks
 * 
 * Widget visibility:
 * - Owner: sees only their own documents
 * - FamilyAdmin: sees all family documents
 * - Editor/Viewer: widget is hidden (handled by parent component)
 */
export function DashboardExpiryWidgetContainer() {
  const router = useRouter();
  const { user } = useAuthContext();

  const { data: expiriesData, isLoading, error } = useGetUpcomingExpiries();

  // Transform expiries for display
  const { transformedExpiries } = useUpcomingExpiryTransform({
    expiries: expiriesData?.data?.upcoming_expiries,
  });

  const handleExpiryClick = useCallback(
    (documentId: string) => {
      router.push(documentRoutes.detail(documentId));
    },
    [router]
  );

  // Hide widget if user doesn't have permission (Editor/Viewer)
  // This should be handled by parent, but we check here as well
  // Note: "member" role corresponds to "owner" in the API context
  const shouldShowWidget = useMemo(() => {
    if (!user) return false;
    return user.role === "member" || user.role === "familyadmin";
  }, [user]);

  if (!shouldShowWidget) {
    return null;
  }

  // Prepare expiry items with handlers
  const expiryItems = useMemo(() => {
    return transformedExpiries.map((expiry) => ({
      documentId: expiry.document_id,
      documentTitle: expiry.document_title,
      daysRemainingLabel: expiry.daysRemainingLabel,
      expiryDateFormatted: expiry.expiryDateFormatted,
      category: expiry.category,
      subcategory: expiry.subcategory,
      urgencyLevel: expiry.urgencyLevel,
      onClick: () => {
        handleExpiryClick(expiry.document_id);
      },
    }));
  }, [transformedExpiries, handleExpiryClick]);

  // Don't show error state in widget - just show empty or loading
  // Errors are handled gracefully
  if (error) {
    return (
      <DashboardExpiryWidget
        expiries={[]}
        isLoading={false}
      />
    );
  }

  return (
    <DashboardExpiryWidget
      expiries={expiryItems}
      isLoading={isLoading}
    />
  );
}

