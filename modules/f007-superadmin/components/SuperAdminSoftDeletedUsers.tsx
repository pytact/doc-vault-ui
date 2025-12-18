/**
 * SuperAdmin Soft-Deleted Users Component
 * SCR_SA_SOFT_DELETED_USERS - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserListResponseItem } from "../types/responses/user";
import { format } from "date-fns";

/**
 * Soft-deleted user row component
 * Memoized to prevent unnecessary re-renders
 */
const SoftDeletedUserRow = React.memo(function SoftDeletedUserRow({
  user,
  canReactivate,
  onViewDetail,
  onReactivate,
}: {
  user: UserListResponseItem;
  canReactivate: boolean;
  onViewDetail: (userId: string) => void;
  onReactivate: (userId: string) => void;
}) {
  const handleNameClick = useCallback(() => {
    onViewDetail(user.id);
  }, [user.id, onViewDetail]);

  const handleReactivateClick = useCallback(() => {
    onReactivate(user.id);
  }, [user.id, onReactivate]);

  const deletedAtFormatted = useMemo(() => {
    return user.deleted_at
      ? format(new Date(user.deleted_at), "MMM dd, yyyy")
      : "N/A";
  }, [user.deleted_at]);

  return (
    <TableRow>
      <TableCell
        className="font-medium text-gray-900 cursor-pointer hover:text-primary-600"
        onClick={handleNameClick}
      >
        {user.name}
      </TableCell>
      <TableCell className="text-gray-600">{user.email}</TableCell>
      <TableCell className="text-gray-600">
        {user.family_id || "N/A"}
      </TableCell>
      <TableCell className="text-gray-600">{deletedAtFormatted}</TableCell>
      <TableCell>
        <Badge variant="danger">Soft-Deleted</Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReactivateClick}
          disabled={!canReactivate}
        >
          Reactivate
        </Button>
      </TableCell>
    </TableRow>
  );
});

interface SuperAdminSoftDeletedUsersProps {
  users: UserListResponseItem[];
  isLoading?: boolean;
  onReactivate: (userId: string) => void;
  onViewDetail: (userId: string) => void;
  canReactivate: (user: UserListResponseItem) => boolean;
}

/**
 * SuperAdmin Soft-Deleted Users UI component
 * Pure presentation - no business logic
 */
export function SuperAdminSoftDeletedUsers({
  users,
  isLoading = false,
  onReactivate,
  onViewDetail,
  canReactivate,
}: SuperAdminSoftDeletedUsersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Loading soft-deleted users...
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Soft-Deleted Users
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and reactivate soft-deleted users
          </p>
        </div>
      </CardHeader>
      <CardBody>
        {users.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No soft-deleted users found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <SoftDeletedUserRow
                  key={user.id}
                  user={user}
                  canReactivate={canReactivate(user)}
                  onViewDetail={onViewDetail}
                  onReactivate={onReactivate}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

