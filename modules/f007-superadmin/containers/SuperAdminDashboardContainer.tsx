/**
 * SuperAdmin Dashboard Container
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React from "react";
import { SuperAdminDashboard } from "../components/SuperAdminDashboard";
import { useAnalyticsDashboard } from "../hooks/useSuperAdminAnalytics";
import { useAnalyticsTransform } from "../hooks/useAnalyticsTransform";

/**
 * SuperAdmin Dashboard container component
 * Handles business logic and API calls via hooks
 */
export function SuperAdminDashboardContainer() {
  const { data: analyticsData, isLoading, error } = useAnalyticsDashboard();
  const { formattedData } = useAnalyticsTransform({
    data: analyticsData?.data,
  });

  if (error) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
        <p className="text-sm font-medium text-danger-800">
          Error loading dashboard metrics
        </p>
        <p className="mt-1 text-sm text-danger-600">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  if (!formattedData) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <SuperAdminDashboard
      metrics={{
        totalFamilies: formattedData.totalFamilies,
        totalActiveUsers: formattedData.activeUsers,
        totalSoftDeletedUsers: formattedData.softDeletedUsers,
        totalDocuments: formattedData.totalDocuments,
      }}
      isLoading={isLoading}
    />
  );
}

