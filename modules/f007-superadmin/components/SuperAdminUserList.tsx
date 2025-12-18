/**
 * SuperAdmin User List Component
 * SCR_SA_USER_LIST - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React, { useMemo, useCallback, useRef } from "react";
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

/**
 * Checkbox for select all functionality
 * Memoized to prevent re-renders
 */
const CheckboxSelectAll = React.memo(function CheckboxSelectAll({
  checked,
  indeterminate,
  onSelectAll,
  onClearSelection,
}: {
  checked: boolean;
  indeterminate: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        onSelectAll();
      } else {
        onClearSelection();
      }
    },
    [onSelectAll, onClearSelection]
  );

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
    />
  );
});

/**
 * User table row component
 * Memoized to prevent unnecessary re-renders
 */
const UserTableRow = React.memo(function UserTableRow({
  user,
  selectedUserIds,
  availableFamilies,
  onUserClick,
  onToggleSelection,
}: {
  user: UserListResponseItem;
  selectedUserIds: Set<string>;
  availableFamilies: Array<{ id: string; name: string }>;
  onUserClick: (userId: string) => void;
  onToggleSelection: (userId: string) => void;
}) {
  const handleRowClick = useCallback(() => {
    onUserClick(user.id);
  }, [user.id, onUserClick]);

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
    },
    []
  );

  const handleCheckboxChange = useCallback(() => {
    onToggleSelection(user.id);
  }, [user.id, onToggleSelection]);

  const familyName = useMemo(() => {
    if (!user.family_id) return "N/A";
    return (
      availableFamilies.find((f) => f.id === user.family_id)?.name || "Unknown"
    );
  }, [user.family_id, availableFamilies]);

  const statusBadge = useMemo(() => {
    if (user.status === "Active") {
      return <Badge className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold shadow-md hover:shadow-lg transition-all min-w-[140px]">Active</Badge>;
    }
    if (user.status === "PendingActivation") {
      return <Badge className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white font-semibold shadow-md hover:shadow-lg transition-all min-w-[140px]">Pending</Badge>;
    }
    return <Badge className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold shadow-md hover:shadow-lg transition-all min-w-[140px]">Deleted</Badge>;
  }, [user.status]);

  return (
    <TableRow
      className="cursor-pointer hover:bg-gray-50"
      onClick={handleRowClick}
    >
      <TableCell onClick={handleCheckboxClick}>
        <input
          type="checkbox"
          checked={selectedUserIds.has(user.id)}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </TableCell>
      <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
      <TableCell className="text-gray-600">{user.email}</TableCell>
      <TableCell className="text-gray-600">{familyName}</TableCell>
      <TableCell>
        <Badge variant="secondary" size="sm">
          {user.roles_summary?.[0] || "No Role"}
        </Badge>
      </TableCell>
      <TableCell>{statusBadge}</TableCell>
    </TableRow>
  );
});

interface SuperAdminUserListProps {
  users: UserListResponseItem[];
  isLoading?: boolean;
  // Selection props
  selectedUserIds: Set<string>;
  onToggleSelection: (userId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  // Action props
  onBulkDelete: () => void;
  onUserClick: (userId: string) => void;
  // Options for filters
  availableRoles: Array<{ id: string; name: string }>;
  availableFamilies: Array<{ id: string; name: string }>;
  // Bulk action state
  canBulkDelete: boolean;
  selectedCount: number;
}

/**
 * SuperAdmin User List UI component
 * Pure presentation - no business logic
 */
export function SuperAdminUserList({
  users,
  isLoading = false,
  selectedUserIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onUserClick,
  availableRoles,
  availableFamilies,
  canBulkDelete,
  selectedCount,
}: SuperAdminUserListProps) {
  const allSelected = useMemo(
    () => users.length > 0 && users.every((u) => selectedUserIds.has(u.id)),
    [users, selectedUserIds]
  );
  const someSelected = useMemo(
    () => selectedCount > 0 && !allSelected,
    [selectedCount, allSelected]
  );

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Loading users...
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage all users across all families
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Bulk Action Toolbar */}
        {selectedCount > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary-900">
                {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
              </span>
              <Button
                variant="subtle"
                size="sm"
                onClick={onClearSelection}
              >
                Clear
              </Button>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={onBulkDelete}
              disabled={!canBulkDelete}
            >
              Bulk Delete
            </Button>
          </div>
        )}

        {/* User Table */}
        {users.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <CheckboxSelectAll
                    checked={allSelected}
                    indeterminate={someSelected}
                    onSelectAll={onSelectAll}
                    onClearSelection={onClearSelection}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Family</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  selectedUserIds={selectedUserIds}
                  availableFamilies={availableFamilies}
                  onUserClick={onUserClick}
                  onToggleSelection={onToggleSelection}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

