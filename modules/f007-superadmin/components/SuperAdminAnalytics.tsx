/**
 * SuperAdmin Analytics Component
 * SCR_SA_ANALYTICS - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { AnalyticsDashboardResponseData } from "../types/responses/analytics";

interface SuperAdminAnalyticsProps {
  data: AnalyticsDashboardResponseData;
  isLoading?: boolean;
}

/**
 * SuperAdmin Analytics UI component
 * Pure presentation - no business logic
 * Memoized to prevent unnecessary re-renders
 */
export const SuperAdminAnalytics = React.memo(function SuperAdminAnalytics({
  data,
  isLoading = false,
}: SuperAdminAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Total Families</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.total_families}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.total_users}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.total_documents}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Active Families</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.active_families}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.active_users}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {data.soft_deleted_users} soft-deleted
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Soft-Deleted Families</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.soft_deleted_families}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Soft-Deleted Users</h3>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold text-gray-900">
              {data.soft_deleted_users}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Placeholder for Charts */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Growth Charts</h2>
        </CardHeader>
        <CardBody>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Charts will be implemented here (Family Growth, User Growth, etc.)</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

