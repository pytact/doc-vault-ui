/**
 * SuperAdmin Dashboard Page
 * Dashboard for SuperAdmin role
 * Based on R11 routing rules
 */

"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth.context";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/types/responses/auth.responses";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import Link from "next/link";
import { familyRoutes } from "@/utils/routing";

export default function SuperAdminDashboardPage() {
  const { user } = useAuthContext();

  return (
    <RouteGuard roles={[UserRole.SuperAdmin]}>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name || "SuperAdmin"}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              <Link
                href={familyRoutes.list}
                className="block rounded-lg p-3 text-sm text-primary-600 hover:bg-gray-50"
              >
                Manage Families
              </Link>
              <Link
                href={familyRoutes.create}
                className="block rounded-lg p-3 text-sm text-primary-600 hover:bg-gray-50"
              >
                Create New Family
              </Link>
            </CardBody>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">System</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">Role</p>
              <p className="mt-1 text-lg font-medium text-gray-900 capitalize">
                {user?.role || "SuperAdmin"}
              </p>
              <p className="mt-4 text-sm text-gray-600">Email</p>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </CardBody>
          </Card>

          {/* Stats Placeholder */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-500">
                System statistics will be displayed here
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-500">
                Activity feed will be displayed here
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}

