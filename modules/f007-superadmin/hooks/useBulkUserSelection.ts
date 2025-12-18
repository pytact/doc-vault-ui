/**
 * Bulk User Selection Business Logic Hook
 * Based on R5 rules
 * Encapsulates bulk user selection and validation logic
 */

import { useState, useCallback, useMemo } from "react";
import { UserListResponseItem } from "../types/responses/user";
import { UserBulkDeleteRequest } from "../types/requests/user";

interface UseBulkUserSelectionParams {
  users: UserListResponseItem[];
  maxSelection?: number; // Default 100 per API spec
}

interface UseBulkUserSelectionReturn {
  selectedUserIds: Set<string>;
  isSelected: (userId: string) => boolean;
  toggleSelection: (userId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectUsers: (userIds: string[]) => void;
  selectedCount: number;
  canSelectMore: boolean;
  isValidForBulkDelete: boolean;
  validationErrors: string[];
  buildBulkDeleteRequest: () => UserBulkDeleteRequest | null;
  getSelectedUsers: () => UserListResponseItem[];
  getValidUsersForDeletion: () => UserListResponseItem[];
}

/**
 * Bulk user selection business logic hook
 * Handles selection state, validation, and request building
 */
export function useBulkUserSelection(
  params: UseBulkUserSelectionParams
): UseBulkUserSelectionReturn {
  const { users, maxSelection = 100 } = params;
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (userId: string) => {
      return selectedUserIds.has(userId);
    },
    [selectedUserIds]
  );

  const toggleSelection = useCallback(
    (userId: string) => {
      setSelectedUserIds((prev) => {
        const next = new Set(prev);
        if (next.has(userId)) {
          next.delete(userId);
        } else {
          // Check if we can select more
          if (next.size < maxSelection) {
            next.add(userId);
          }
        }
        return next;
      });
    },
    [maxSelection]
  );

  // Get users that are valid for deletion (not already soft-deleted)
  const getValidUsersForDeletion = useCallback((): UserListResponseItem[] => {
    return users.filter((user) => user.status !== "SoftDeleted" && !user.is_del);
  }, [users]);

  const selectAll = useCallback(() => {
    // Only select up to maxSelection users
    const validUsers = getValidUsersForDeletion();
    const usersToSelect = validUsers.slice(0, maxSelection).map((u) => u.id);
    setSelectedUserIds(new Set(usersToSelect));
  }, [maxSelection, getValidUsersForDeletion]);

  const clearSelection = useCallback(() => {
    setSelectedUserIds(new Set());
  }, []);

  const selectUsers = useCallback((userIds: string[]) => {
    // Filter to only valid user IDs and respect max selection
    const validUserIds = userIds.filter((id) =>
      users.some((u) => u.id === id && u.status !== "SoftDeleted" && !u.is_del)
    );
    const limitedUserIds = validUserIds.slice(0, maxSelection);
    setSelectedUserIds(new Set(limitedUserIds));
  }, [users, maxSelection]);

  const selectedCount = useMemo(() => {
    return selectedUserIds.size;
  }, [selectedUserIds]);

  const canSelectMore = useMemo(() => {
    return selectedCount < maxSelection;
  }, [selectedCount, maxSelection]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (selectedCount === 0) {
      errors.push("At least one user must be selected");
    }

    if (selectedCount > maxSelection) {
      errors.push(`Maximum ${maxSelection} users can be selected at once`);
    }

    // Check if any selected users are already soft-deleted
    const selectedUsers = users.filter((u) => selectedUserIds.has(u.id));
    const invalidUsers = selectedUsers.filter(
      (u) => u.status === "SoftDeleted" || u.is_del
    );

    if (invalidUsers.length > 0) {
      errors.push(
        `${invalidUsers.length} selected user(s) are already soft-deleted and will be skipped`
      );
    }

    return errors;
  }, [selectedCount, selectedUserIds, users, maxSelection]);

  const isValidForBulkDelete = useMemo(() => {
    return validationErrors.length === 0 && selectedCount > 0 && selectedCount <= maxSelection;
  }, [validationErrors, selectedCount, maxSelection]);

  const buildBulkDeleteRequest = useCallback((): UserBulkDeleteRequest | null => {
    if (!isValidForBulkDelete) {
      return null;
    }

    // Filter out already soft-deleted users
    const validUserIds = Array.from(selectedUserIds).filter((userId) => {
      const user = users.find((u) => u.id === userId);
      return user && user.status !== "SoftDeleted" && !user.is_del;
    });

    if (validUserIds.length === 0) {
      return null;
    }

    return {
      user_ids: validUserIds,
    };
  }, [isValidForBulkDelete, selectedUserIds, users]);

  const getSelectedUsers = useCallback((): UserListResponseItem[] => {
    return users.filter((u) => selectedUserIds.has(u.id));
  }, [users, selectedUserIds]);

  return {
    selectedUserIds,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    selectUsers,
    selectedCount,
    canSelectMore,
    isValidForBulkDelete,
    validationErrors,
    buildBulkDeleteRequest,
    getSelectedUsers,
    getValidUsersForDeletion,
  };
}

