/**
 * Dashboard Page
 * Role-based dashboard for FamilyAdmin and Member
 * Based on R11 routing rules
 */

"use client";

import React from "react";
import { useAuthContext } from "@/contexts/auth.context";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import Link from "next/link";
import { userRoutes, profileRoutes, documentRoutes, notificationRoutes } from "@/utils/routing";
import { useUserList } from "@/modules/f001-identity/hooks/useUsers";
import { useFamilyContext } from "@/contexts/family.context";
import { useListDocuments } from "@/modules/f003-documents/hooks/useDocuments";
import { DashboardExpiryWidgetContainer } from "@/modules/f005-notifications/containers/DashboardExpiryWidgetContainer";
import { useListNotifications } from "@/modules/f005-notifications/hooks/useNotifications";
import { useNotificationListTransform } from "@/modules/f005-notifications/hooks/useNotificationListTransform";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { familyId } = useFamilyContext();
  const { data: usersData, isLoading: usersLoading } = useUserList(familyId || null);
  const { data: documentsData, isLoading: documentsLoading } = useListDocuments();
  
  // Fetch notifications for summary (using default pagination)
  const { data: notificationsData } = useListNotifications();
  const { unreadCount } = useNotificationListTransform({
    notifications: notificationsData?.data?.items,
  });

  // Calculate statistics for FamilyAdmin
  const totalUsers = usersData?.data?.total || 0;
  const activeUsers = (usersData?.data?.items || []).filter(
    (u) => u.status === "Active"
  ).length;
  const pendingUsers = (usersData?.data?.items || []).filter(
    (u) => u.status === "PendingActivation"
  ).length;
  
  // Calculate document statistics
  const totalDocuments = documentsData?.data?.total || 0;
  const documentsWithFiles = (documentsData?.data?.items || []).filter(
    (doc) => doc.file_path !== null
  ).length;

  return (
    <RouteGuard roles={[UserRole.FamilyAdmin, UserRole.Member]}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">Welcome back, {user?.name || "User"}!</h1>
          <p className="mt-2 text-lg text-primary-100">
            Here&apos;s what&apos;s happening with your account today.
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
                href={profileRoutes.settings}
                className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile Settings
              </Link>
              {user?.role === UserRole.FamilyAdmin && (
                <Link
                  href={userRoutes.list}
                  className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  View All Users
                </Link>
              )}
              <Link
                href={documentRoutes.list}
                className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Documents
              </Link>
              <Link
                href={notificationRoutes.list}
                className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                View Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-danger-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </CardBody>
          </Card>

          {/* Documents Section */}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Documents</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Documents</p>
                {documentsLoading ? (
                  <p className="mt-1 text-lg font-semibold text-primary-600">Loading...</p>
                ) : (
                  <p className="mt-1 text-lg font-semibold text-primary-600">{totalDocuments}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">With Files</p>
                {documentsLoading ? (
                  <p className="mt-1 text-sm text-slate-500">Loading...</p>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">{documentsWithFiles} documents have PDF files</p>
                )}
              </div>
              <Link
                href={documentRoutes.list}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Manage Documents
              </Link>
            </CardBody>
          </Card>

          {/* Family Info */}
          {user?.family_name && (
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Family</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Family Name</p>
                  <p className="mt-2 text-2xl font-bold text-primary-600">
                    {user.family_name}
                  </p>
                </div>
                {user?.role === UserRole.FamilyAdmin && (
                  <div>
                    <p className="text-sm font-medium text-slate-600">Family Users</p>
                    {usersLoading ? (
                      <p className="mt-1 text-lg font-semibold text-primary-600">Loading...</p>
                    ) : (
                      <>
                        <p className="mt-1 text-lg font-semibold text-primary-600">{totalUsers}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {activeUsers} active, {pendingUsers} pending activation
                        </p>
                      </>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* User Info */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Account</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Role</p>
                <p className="mt-1 text-lg font-semibold text-primary-600 capitalize">
                {user?.role || "Member"}
              </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Email</p>
                <p className="mt-1 text-sm text-slate-900">{user?.email}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Notifications Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Expiries Widget */}
          <DashboardExpiryWidgetContainer />

          {/* Notifications Summary */}
          <Card variant="elevated" className="border-l-4 border-l-primary-500">
            <CardHeader>
              <div className="flex items-center justify-between">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Unread Notifications</p>
                <p className="mt-1 text-lg font-semibold text-primary-600">
                  {unreadCount > 0 ? unreadCount : "None"}
                </p>
              </div>
              <Link
                href={notificationRoutes.list}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                View All Notifications
              </Link>
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

