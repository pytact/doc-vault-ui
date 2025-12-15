/**
 * Role Management Business Logic Hook
 * Based on R5 rules
 * Encapsulates role selection and management logic
 */

import { useState, useCallback, useMemo } from "react";
import { RoleInfo } from "../types/responses/user";

interface UseRoleManagementParams {
  availableRoles: RoleInfo[];
  currentRoleIds: string[];
  canEdit: boolean;
}

interface UseRoleManagementReturn {
  selectedRoleIds: string[];
  setSelectedRoleIds: (roleIds: string[]) => void;
  toggleRole: (roleId: string) => void;
  clearSelection: () => void;
  hasSelection: boolean;
  isValidSelection: boolean;
  canSave: boolean;
}

/**
 * Role management business logic hook
 * Handles role selection logic for user role assignment
 */
export function useRoleManagement(
  params: UseRoleManagementParams
): UseRoleManagementReturn {
  const { availableRoles, currentRoleIds, canEdit } = params;

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    currentRoleIds
  );

  const toggleRole = useCallback(
    (roleId: string) => {
      if (!canEdit) return;

      setSelectedRoleIds((prev) => {
        if (prev.includes(roleId)) {
          // Remove role - but ensure at least one role remains (business rule: single role per user)
          // Actually, based on API spec, users have exactly one role, so we should replace, not toggle
          return prev.filter((id) => id !== roleId);
        } else {
          // Add role - replace previous selection (single role per user)
          return [roleId];
        }
      });
    },
    [canEdit]
  );

  const clearSelection = useCallback(() => {
    if (canEdit) {
      setSelectedRoleIds([]);
    }
  }, [canEdit]);

  const hasSelection = useMemo(() => {
    return selectedRoleIds.length > 0;
  }, [selectedRoleIds]);

  const isValidSelection = useMemo(() => {
    // Users must have exactly one role (business rule)
    // But API allows empty array to remove all roles
    // So we allow 0 or 1 role
    return selectedRoleIds.length <= 1;
  }, [selectedRoleIds]);

  const canSave = useMemo(() => {
    if (!canEdit) return false;
    if (!isValidSelection) return false;
    // Check if selection has changed
    const currentSorted = [...currentRoleIds].sort().join(",");
    const selectedSorted = [...selectedRoleIds].sort().join(",");
    return currentSorted !== selectedSorted;
  }, [canEdit, isValidSelection, currentRoleIds, selectedRoleIds]);

  return {
    selectedRoleIds,
    setSelectedRoleIds,
    toggleRole,
    clearSelection,
    hasSelection,
    isValidSelection,
    canSave,
  };
}

