/**
 * Dashboard Page
 * Role-based dashboard for FamilyAdmin and Member
 * Based on R11 routing rules
 */

"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth.context";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/types/responses/auth.responses";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import Link from "next/link";
import { userRoutes, profileRoutes } from "@/utils/routing";

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <RouteGuard roles={[UserRole.FamilyAdmin, UserRole.Member]}>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name || "User"}!
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
                href={profileRoutes.settings}
                className="block rounded-lg p-3 text-sm text-primary-600 hover:bg-gray-50"
              >
                View Profile Settings
              </Link>
              {user?.role === UserRole.FamilyAdmin && (
                <Link
                  href={userRoutes.list}
                  className="block rounded-lg p-3 text-sm text-primary-600 hover:bg-gray-50"
                >
                  Manage Users
                </Link>
              )}
            </CardBody>
          </Card>

          {/* Family Info */}
          {user?.family_name && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Family</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600">Family Name</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {user.family_name}
                </p>
              </CardBody>
            </Card>
          )}

          {/* User Info */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600">Role</p>
              <p className="mt-1 text-lg font-medium text-gray-900 capitalize">
                {user?.role || "Member"}
              </p>
              <p className="mt-4 text-sm text-gray-600">Email</p>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </CardBody>
          </Card>
        </div>

        {/* Placeholder for future features */}
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

