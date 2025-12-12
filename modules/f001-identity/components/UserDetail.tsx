/**
 * User Detail Component
 * SCR_USER_DETAIL - Pure UI component
 * Based on R7, R12, R16, R14 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { useUserDetailTransform } from "@/hooks/useUserDetailTransform";
import type { UserDetailResponse } from "@/types/responses/user.responses";
import Link from "next/link";
import { userRoutes } from "@/utils/routing";

interface UserDetailProps {
  user: UserDetailResponse;
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  currentUserId: string | null;
  onManageRoles: () => void;
  onSoftDelete: () => void;
}

/**
 * User detail UI component
 * Pure presentation - no business logic
 */
export const UserDetail = React.memo(function UserDetail({
  user,
  currentUserRole,
  currentUserId,
  onManageRoles,
  onSoftDelete,
}: UserDetailProps) {
  const { transformedUser, allowedRoleManagement, canPerformActions } =
    useUserDetailTransform({
      user,
      currentUserRole,
      currentUserId,
    });

  const getStatusBadge = React.useCallback(
    (status: string) => {
      if (status === "Active") {
        return <Badge variant="success">Active</Badge>;
      }
      if (status === "PendingActivation") {
        return <Badge variant="warning">Pending</Badge>;
      }
      if (status === "SoftDeleted") {
        return <Badge variant="secondary">Deleted</Badge>;
      }
      return <Badge>{status}</Badge>;
    },
    []
  );

  if (!transformedUser) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={userRoutes.list}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            ← Back to Users
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {transformedUser.name}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              <p className="mt-1 text-sm text-gray-600">View and manage user details</p>
            </div>
            {getStatusBadge(transformedUser.status)}
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{transformedUser.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{transformedUser.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <div className="mt-1 flex items-center gap-2">
              {transformedUser.currentRole ? (
                <Badge variant="secondary">{transformedUser.currentRole.name}</Badge>
              ) : (
                <span className="text-gray-500">No role assigned</span>
              )}
            </div>
          </div>

          {transformedUser.activated_at && (
            <div>
              <label className="text-sm font-medium text-gray-700">Activated At</label>
              <p className="mt-1 text-gray-900">{transformedUser.activatedAtFormatted}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1 text-gray-900">{transformedUser.createdAtFormatted}</p>
          </div>
        </CardBody>

        {canPerformActions && transformedUser.status !== "SoftDeleted" && (
          <CardFooter className="flex gap-2">
            {allowedRoleManagement && (
              <Button onClick={onManageRoles} variant="outline">
                Manage Roles
              </Button>
            )}
            <Button onClick={onSoftDelete} variant="danger">
              Soft Delete User
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
});
