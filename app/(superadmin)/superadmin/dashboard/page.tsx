/**
 * SuperAdmin Dashboard Page
 * Dashboard for SuperAdmin role
 * Based on R11 routing rules
 */

"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth.context";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import Link from "next/link";
import { familyRoutes, userRoutes } from "@/utils/routing";
import { useFamilyList } from "@/modules/f001-identity/hooks/useFamilies";
import { useUserListAll } from "@/modules/f001-identity/hooks/useUsers";

export default function SuperAdminDashboardPage() {
  const { user } = useAuthContext();
  const { data: familiesData, isLoading: familiesLoading } = useFamilyList();
  const { data: usersData, isLoading: usersLoading } = useUserListAll();

  // Calculate statistics
  const totalFamilies = familiesData?.data?.total || 0;
  const activeFamilies = (familiesData?.data?.items || []).filter(
    (f) => f.status === "Active"
  ).length;
  const totalUsers = usersData?.data?.total || 0;
  const activeUsers = (usersData?.data?.items || []).filter(
    (u) => u.status === "Active"
  ).length;
  const pendingUsers = (usersData?.data?.items || []).filter(
    (u) => u.status === "PendingActivation"
  ).length;

  return (
    <RouteGuard roles={[UserRole.SuperAdmin]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-white/20 p-2">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-primary-100 uppercase tracking-wide">SuperAdmin</span>
          </div>
          <h1 className="text-4xl font-bold">Welcome back, {user?.name || "SuperAdmin"}!</h1>
          <p className="mt-2 text-lg text-primary-100">
            Manage all families and users across the system.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card variant="elevated" className="border-l-4 border-l-primary-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              <Link
                href={familyRoutes.list}
                className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Families
              </Link>
              <Link
                href={familyRoutes.create}
                className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Family
              </Link>
              <Link
                href={userRoutes.listAll}
                className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                View All Users
              </Link>
            </CardBody>
          </Card>

          {/* System Info */}
          <Card variant="elevated" className="border-l-4 border-l-primary-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">System</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Role</p>
                <p className="mt-1 text-lg font-semibold text-primary-600 capitalize">
                  {user?.role || "SuperAdmin"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Email</p>
                <p className="mt-1 text-sm text-slate-900">{user?.email}</p>
              </div>
            </CardBody>
          </Card>

          {/* Statistics */}
          <Card variant="elevated" className="border-l-4 border-l-primary-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-100 p-2">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">System Statistics</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {familiesLoading || usersLoading ? (
                <div className="text-center py-4 text-slate-500">Loading statistics...</div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Families</p>
                    <p className="mt-1 text-2xl font-bold text-primary-600">{totalFamilies}</p>
                    <p className="mt-1 text-xs text-slate-500">{activeFamilies} active</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Users</p>
                    <p className="mt-1 text-2xl font-bold text-primary-600">{totalUsers}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {activeUsers} active, {pendingUsers} pending
                    </p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary-100 p-4 mb-4">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-600">Activity feed will be displayed here</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </RouteGuard>
  );
}

