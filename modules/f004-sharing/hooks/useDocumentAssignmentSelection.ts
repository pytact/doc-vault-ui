/**
 * Document Assignment Selection Hook
 * Based on R5 rules
 * Encapsulates multi-select logic for bulk assignment operations
 */

import { useState, useMemo, useCallback } from "react";
import type { UserSummary } from "../types/responses/document-assignment";

interface UseDocumentAssignmentSelectionParams {
  availableUsers: UserSummary[];
  alreadyAssignedUserIds: string[];
  documentOwnerId: string | null;
  currentUserId: string | null;
}

interface UseDocumentAssignmentSelectionReturn {
  selectedUserIds: string[];
  toggleUserSelection: (userId: string) => void;
  selectAllUsers: () => void;
  clearSelection: () => void;
  selectableUsers: UserSummary[];
  disabledUserIds: string[];
  isUserSelectable: (userId: string) => boolean;
  isUserSelected: (userId: string) => boolean;
  selectedCount: number;
}

/**
 * Document assignment selection hook
 * Manages multi-select state for bulk assignment modal
 */
export function useDocumentAssignmentSelection(
  params: UseDocumentAssignmentSelectionParams
): UseDocumentAssignmentSelectionReturn {
  const {
    availableUsers,
    alreadyAssignedUserIds,
    documentOwnerId,
    currentUserId,
  } = params;

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Users that cannot be selected (already assigned, owner, or self)
  const disabledUserIds = useMemo(() => {
    const disabled: string[] = [...alreadyAssignedUserIds];
    
    // Cannot select document owner
    if (documentOwnerId) {
      disabled.push(documentOwnerId);
    }
    
    // Cannot select self (if self-assignment prevention is needed)
    if (currentUserId) {
      disabled.push(currentUserId);
    }
    
    return [...new Set(disabled)]; // Remove duplicates
  }, [alreadyAssignedUserIds, documentOwnerId, currentUserId]);

  // Users that can be selected (not disabled)
  const selectableUsers = useMemo(() => {
    return availableUsers.filter(
      (user) => !disabledUserIds.includes(user.id)
    );
  }, [availableUsers, disabledUserIds]);

  const toggleUserSelection = useCallback(
    (userId: string) => {
      setSelectedUserIds((prev) => {
        if (prev.includes(userId)) {
          return prev.filter((id) => id !== userId);
        } else {
          return [...prev, userId];
        }
      });
    },
    []
  );

  const selectAllUsers = useCallback(() => {
    const selectableIds = selectableUsers.map((user) => user.id);
    setSelectedUserIds(selectableIds);
  }, [selectableUsers]);

  const clearSelection = useCallback(() => {
    setSelectedUserIds([]);
  }, []);

  const isUserSelectable = useCallback(
    (userId: string) => {
      return !disabledUserIds.includes(userId);
    },
    [disabledUserIds]
  );

  const isUserSelected = useCallback(
    (userId: string) => {
      return selectedUserIds.includes(userId);
    },
    [selectedUserIds]
  );

  const selectedCount = useMemo(() => {
    return selectedUserIds.length;
  }, [selectedUserIds]);

  return {
    selectedUserIds,
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
    selectableUsers,
    disabledUserIds,
    isUserSelectable,
    isUserSelected,
    selectedCount,
  };
}

