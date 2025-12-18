/**
 * SuperAdmin Analytics Page
 * Route: /superadmin/analytics
 * Based on R11 and R14 rules
 * Lazy loaded for performance optimization
 */

"use client";

import dynamic from "next/dynamic";

// Lazy load Analytics container for code splitting (R14)
const SuperAdminAnalyticsContainer = dynamic(
  () =>
    import(
      "@/modules/f007-superadmin/containers/SuperAdminAnalyticsContainer"
    ).then((mod) => ({ default: mod.SuperAdminAnalyticsContainer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    ),
  }
);

export default function SuperAdminAnalyticsPage() {
  return <SuperAdminAnalyticsContainer />;
}

