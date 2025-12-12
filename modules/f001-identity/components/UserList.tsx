/**
 * User List Component
 * SCR_USER_LIST - Pure UI component
 * Based on R7, R12, R16, R14 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { useUserListTransform } from "@/hooks/useUserListTransform";
import type { UserListResponseItem } from "@/types/responses/user.responses";
import Link from "next/link";
import { userRoutes } from "@/utils/routing";

interface UserListProps {
  users: UserListResponseItem[];
  isLoading?: boolean;
  onInviteUser: () => void;
  canInviteUsers: boolean;
}

/**
 * User list UI component
 * Pure presentation - no business logic
 */
export const UserList = React.memo(function UserList({
  users,
  isLoading = false,
  onInviteUser,
  canInviteUsers,
}: UserListProps) {
  const { transformedUsers } = useUserListTransform({ users });

  const getStatusBadge = React.useCallback(
    (status: string, isExpired: boolean) => {
      if (status === "Active") {
        return <Badge variant="success">Active</Badge>;
      }
      if (status === "PendingActivation") {
        return isExpired ? (
          <Badge variant="danger">Expired</Badge>
        ) : (
          <Badge variant="warning">Pending</Badge>
        );
      }
      if (status === "SoftDeleted") {
        return <Badge variant="secondary">Deleted</Badge>;
      }
      return <Badge>{status}</Badge>;
    },
    []
  );

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading users...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage users in your family
            </p>
          </div>
          {canInviteUsers && (
            <Button onClick={onInviteUser} variant="primary">
              Invite User
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {transformedUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found. Invite a user to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedUsers.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link
                      href={userRoutes.detail(user.id)}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.roleName}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status, user.isActivationExpired)}
                  </TableCell>
                  <TableCell>{user.createdAtFormatted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
});
