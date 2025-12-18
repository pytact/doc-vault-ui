/**
 * SuperAdmin User List Container
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminUserList } from "../components/SuperAdminUserList";
import { useUserListAll } from "@/modules/f001-identity/hooks/useUsers";
import { useBulkUserSelection } from "../hooks/useBulkUserSelection";
import { usePagination } from "@/hooks/usePagination";
import { useModalState } from "@/hooks/useModalState";
import { useBulkDeleteUsers } from "../hooks/useSuperAdminUsers";
import { useFamilyList } from "../hooks/useSuperAdminFamilies";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { UserListParams as F001UserListParams } from "@/modules/f001-identity/types/requests/user";
import type { UserListResponseItem as F001UserListResponseItem } from "@/modules/f001-identity/types/responses/user";
import type { UserListResponseItem } from "../types/responses/user";

/**
 * SuperAdmin User List container component
 * Handles business logic and API calls via hooks
 */
export function SuperAdminUserListContainer() {
  const router = useRouter();
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 20,
  });
  const { isOpen: isBulkDeleteOpen, open: openBulkDelete, close: closeBulkDelete } = useModalState();

  // Build list params from filters and pagination - adapt to f001-identity format
  const f001ListParams: F001UserListParams = useMemo(() => {
    return {
      page: pagination.page,
      page_size: pagination.pageSize,
      status: null,
      sort_by: "created_at",
      sort_order: "desc",
    };
  }, [pagination]);

  const { data: usersData, isLoading, error } = useUserListAll(f001ListParams);

  // Adapt f001-identity response items to SuperAdmin format
  const adaptedUsers: UserListResponseItem[] = useMemo(() => {
    return (usersData?.data?.items || []).map((item: F001UserListResponseItem) => ({
      ...item,
      family_id: item.family_id || "", // Ensure family_id is always a string
    })) as UserListResponseItem[];
  }, [usersData]);
  const { data: familiesData } = useFamilyList();
  const bulkSelection = useBulkUserSelection({
    users: adaptedUsers,
    maxSelection: 100,
  });
  const bulkDeleteMutation = useBulkDeleteUsers();

  // Get available roles (would come from roles API in real implementation)
  const availableRoles = useMemo(() => {
    // Extract unique roles from users
    const roleSet = new Set<string>();
    adaptedUsers.forEach((user) => {
      user.roles_summary?.forEach((role) => roleSet.add(role));
    });
    return Array.from(roleSet).map((role) => ({
      id: role,
      name: role,
    }));
  }, [adaptedUsers]);

  const availableFamilies = useMemo(() => {
    return (familiesData?.data?.items || []).map((family) => ({
      id: family.id,
      name: family.name,
    }));
  }, [familiesData]);

  const handleUserClick = useCallback(
    (userId: string) => {
      router.push(`/superadmin/users/${userId}`);
    },
    [router]
  );

  const handleBulkDelete = useCallback(() => {
    const request = bulkSelection.buildBulkDeleteRequest();
    if (request) {
      openBulkDelete();
    }
  }, [bulkSelection, openBulkDelete]);

  const handleConfirmBulkDelete = useCallback(() => {
    const request = bulkSelection.buildBulkDeleteRequest();
    if (request) {
      bulkDeleteMutation.mutate(request, {
        onSuccess: () => {
          bulkSelection.clearSelection();
          closeBulkDelete();
        },
      });
    }
  }, [bulkSelection, bulkDeleteMutation, closeBulkDelete]);

  if (error) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
        <p className="text-sm font-medium text-danger-800">
          Error loading users
        </p>
        <p className="mt-1 text-sm text-danger-600">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <>
      <SuperAdminUserList
        users={adaptedUsers}
        isLoading={isLoading}
        selectedUserIds={bulkSelection.selectedUserIds}
        onToggleSelection={bulkSelection.toggleSelection}
        onSelectAll={bulkSelection.selectAll}
        onClearSelection={bulkSelection.clearSelection}
        onBulkDelete={handleBulkDelete}
        onUserClick={handleUserClick}
        availableRoles={availableRoles}
        availableFamilies={availableFamilies}
        canBulkDelete={bulkSelection.isValidForBulkDelete}
        selectedCount={bulkSelection.selectedCount}
      />

      {/* Bulk Delete Modal */}
      <Modal
        isOpen={isBulkDeleteOpen}
        onClose={closeBulkDelete}
        title="Bulk Delete Users"
        size="lg"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
            <p className="text-sm font-medium text-warning-800">
              Warning: This action cannot be undone
            </p>
            <p className="mt-1 text-sm text-warning-700">
              {bulkSelection.selectedCount} user{bulkSelection.selectedCount !== 1 ? "s" : ""} will be soft-deleted.
              This will also soft-delete all documents owned by these users.
            </p>
          </div>

          {bulkSelection.validationErrors.length > 0 && (
            <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
              <ul className="list-disc list-inside text-sm text-danger-800">
                {bulkSelection.validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeBulkDelete}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmBulkDelete}
              disabled={!bulkSelection.isValidForBulkDelete || bulkDeleteMutation.isPending}
              isLoading={bulkDeleteMutation.isPending}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

