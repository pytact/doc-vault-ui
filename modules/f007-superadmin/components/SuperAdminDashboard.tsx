/**
 * SuperAdmin Dashboard Component
 * SCR_SA_DASHBOARD - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React, { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface SummaryCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

/**
 * Summary Card component for dashboard metrics
 * Memoized to prevent unnecessary re-renders
 */
const SummaryCard = React.memo(function SummaryCard({
  title,
  value,
  description,
  icon,
  variant = "default",
  className,
}: SummaryCardProps) {
  const variantStyles = useMemo(
    () => ({
      default: "border-gray-200",
      primary: "border-primary-300 bg-primary-50",
      success: "border-success-300 bg-success-50",
      warning: "border-warning-300 bg-warning-50",
    }),
    []
  );

  return (
    <Card variant="default" className={cn(variantStyles[variant], className)}>
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
          {icon && (
            <div className="ml-4 flex-shrink-0 text-gray-400">{icon}</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
});

interface QuickLinkProps {
  href: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

/**
 * Quick Navigation Link component
 * Memoized to prevent unnecessary re-renders
 */
const QuickLink = React.memo(function QuickLink({ href, label, description, icon }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
    >
      <div className="flex items-center">
        {icon && <div className="mr-3 text-primary-600">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{label}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
});

interface SuperAdminDashboardProps {
  metrics: {
    totalFamilies: number;
    totalActiveUsers: number;
    totalSoftDeletedUsers: number;
    totalDocuments: number;
  };
  isLoading?: boolean;
}

/**
 * SuperAdmin Dashboard UI component
 * Pure presentation - no business logic
 * Memoized to prevent unnecessary re-renders
 */
export const SuperAdminDashboard = React.memo(function SuperAdminDashboard({
  metrics,
  isLoading = false,
}: SuperAdminDashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardBody className="p-6">
                <div className="h-20 animate-pulse rounded bg-gray-200" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Families"
          value={metrics.totalFamilies}
          description="All families in the system"
          variant="primary"
        />
        <SummaryCard
          title="Active Users"
          value={metrics.totalActiveUsers}
          description="Currently active users"
          variant="success"
        />
        <SummaryCard
          title="Soft-Deleted Users"
          value={metrics.totalSoftDeletedUsers}
          description="Users marked for deletion"
          variant="warning"
        />
        <SummaryCard
          title="Total Documents"
          value={metrics.totalDocuments}
          description="All documents (count only)"
          variant="default"
        />
      </div>

      {/* Quick Navigation Panel */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Navigation
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuickLink
              href="/superadmin/families"
              label="Manage Families"
              description="View and create families"
            />
            <QuickLink
              href="/superadmin/users"
              label="Manage Users"
              description="View and manage all users"
            />
            <QuickLink
              href="/superadmin/deleted/users"
              label="Soft-Deleted Users"
              description="View and reactivate deleted users"
            />
            <QuickLink
              href="/superadmin/deleted/families"
              label="Soft-Deleted Families"
              description="View deleted families"
            />
            <QuickLink
              href="/superadmin/analytics"
              label="Analytics Dashboard"
              description="View platform metrics and growth"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

