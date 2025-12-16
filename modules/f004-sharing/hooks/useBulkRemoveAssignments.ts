/**
 * Bulk Remove Assignments Hook
 * Based on R5 rules
 * Handles bulk deletion of document assignments
 */

import { useState, useCallback, useMemo } from "react";

interface UseBulkRemoveAssignmentsParams {
  assignments: Array<{ 
    assign_to_user_id?: string; 
    user?: { name?: string; email?: string; id?: string };
    access_type?: "viewer" | "editor";
  }>;
}

interface UseBulkRemoveAssignmentsReturn {
  selectedUserIds: string[];
  toggleSelection: (userId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (userId: string) => boolean;
  selectedCount: number;
  selectedAssignments: Array<{ userId: string; userName: string; userEmail?: string; accessType?: "viewer" | "editor" }>;
}

/**
 * Hook for managing bulk removal selection state
 */
export function useBulkRemoveAssignments(
  params: UseBulkRemoveAssignmentsParams
): UseBulkRemoveAssignmentsReturn {
  const { assignments } = params;
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const toggleSelection = useCallback((userId: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, []);

  const selectAll = useCallback(() => {
    const allUserIds = assignments
      .map((a) => a.assign_to_user_id || a.user?.id || a.user?.email)
      .filter((id): id is string => !!id);
    setSelectedUserIds(allUserIds);
  }, [assignments]);

  const clearSelection = useCallback(() => {
    setSelectedUserIds([]);
  }, []);

  const isSelected = useCallback(
    (userId: string) => {
      return selectedUserIds.includes(userId);
    },
    [selectedUserIds]
  );

  const selectedCount = useMemo(() => {
    return selectedUserIds.length;
  }, [selectedUserIds]);

  const selectedAssignments = useMemo(() => {
    return assignments
      .filter((a) => {
        const userId = a.assign_to_user_id || a.user?.id || a.user?.email;
        return userId && selectedUserIds.includes(userId);
      })
      .map((a) => ({
        userId: a.assign_to_user_id || a.user?.id || a.user?.email || "",
        userName: a.user?.name || a.user?.email || "this user",
        userEmail: a.user?.email,
        accessType: a.access_type,
      }));
  }, [assignments, selectedUserIds]);

  return {
    selectedUserIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount,
    selectedAssignments,
  };
}

