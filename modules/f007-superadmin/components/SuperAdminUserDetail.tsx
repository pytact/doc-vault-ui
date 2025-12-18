/**
 * SuperAdmin User Detail Component
 * SCR_SA_USER_DETAIL - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { UserResponse } from "../types/responses/user";
import { format } from "date-fns";
import Link from "next/link";

interface SuperAdminUserDetailProps {
  user: UserResponse;
  isLoading?: boolean;
  // Action handlers
  onReassign: () => void;
  onSoftDelete: () => void;
  onReactivate?: () => void;
  onResendInvite?: () => void;
  // State flags
  canReassign: boolean;
  canDelete: boolean;
  canReactivate: boolean;
  canResendInvite: boolean;
  // Display data
  currentFamilyName?: string;
  currentRoleName?: string;
}

/**
 * SuperAdmin User Detail UI component
 * Pure presentation - no business logic
 * Memoized to prevent unnecessary re-renders
 */
export const SuperAdminUserDetail = React.memo(function SuperAdminUserDetail({
  user,
  isLoading = false,
  onReassign,
  onSoftDelete,
  onReactivate,
  onResendInvite,
  canReassign,
  canDelete,
  canReactivate,
  canResendInvite,
  currentFamilyName,
  currentRoleName,
}: SuperAdminUserDetailProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  const getStatusBadge = useCallback((status: string) => {
    if (status === "Active") {
      return <Badge variant="success">Active</Badge>;
    }
    if (status === "PendingActivation") {
      return <Badge variant="warning">Pending</Badge>;
    }
    if (status === "SoftDeleted") {
      return <Badge variant="danger">Soft-Deleted</Badge>;
    }
    return <Badge>{status}</Badge>;
  }, []);

  const statusBadge = useMemo(
    () => getStatusBadge(user.status),
    [user.status, getStatusBadge]
  );

  const isPending = useMemo(
    () => user.status === "PendingActivation",
    [user.status]
  );
  const isDeleted = useMemo(
    () => user.status === "SoftDeleted",
    [user.status]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/superadmin/users"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            ← Back to Users
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            {statusBadge}
          </div>
          <p className="mt-1 text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-base text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">{statusBadge}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Family</label>
              <p className="mt-1 text-base text-gray-900">
                {currentFamilyName || "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Role</label>
              <p className="mt-1 text-base text-gray-900">
                {currentRoleName || user.roles_list?.[0]?.name || "No Role"}
              </p>
            </div>
            {user.activated_at && (
              <div>
                <label className="text-sm font-medium text-gray-500">Activated At</label>
                <p className="mt-1 text-base text-gray-900">
                  {format(new Date(user.activated_at), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            )}
            {user.created_at && (
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-base text-gray-900">
                  {format(new Date(user.created_at), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Family & Role Panel */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Family & Role Management</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Reassign this user to a different family and optionally change their role.
              </p>
            </div>
            <Button
              onClick={onReassign}
              disabled={!canReassign || isDeleted}
              variant="outline"
            >
              Reassign Family
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Lifecycle Management Panel */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Lifecycle Management</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {isPending && canResendInvite && onResendInvite && (
            <div>
              <p className="mb-2 text-sm text-gray-600">
                This user has a pending invitation. You can resend the invite email.
              </p>
              <Button onClick={onResendInvite} variant="outline">
                Resend Invite
              </Button>
            </div>
          )}

          {isDeleted && canReactivate && onReactivate && (
            <div>
              <p className="mb-2 text-sm text-gray-600">
                This user has been soft-deleted. You can reactivate them.
              </p>
              <Button onClick={onReactivate} variant="primary">
                Reactivate User
              </Button>
            </div>
          )}

          {!isDeleted && canDelete && (
            <div>
              <p className="mb-2 text-sm text-gray-600">
                Soft-delete this user. This will also soft-delete all documents owned by this user.
              </p>
              <Button onClick={onSoftDelete} className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold shadow-md hover:shadow-lg transition-all min-w-[140px]">
                Soft Delete User
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
});

