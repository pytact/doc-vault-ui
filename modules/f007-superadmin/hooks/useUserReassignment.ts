/**
 * User Reassignment Business Logic Hook
 * Based on R5 rules
 * Encapsulates user reassignment validation and state management
 */

import { useState, useCallback, useMemo } from "react";
import { UserReassignRequest } from "../types/requests/user";
import { FamilyResponse } from "../types/responses/family";
import { UserResponse } from "../types/responses/user";

interface UseUserReassignmentParams {
  user: UserResponse | null;
  availableFamilies: FamilyResponse[];
  availableRoles: Array<{ id: string; name: string }>;
}

interface UseUserReassignmentReturn {
  selectedFamilyId: string | null;
  selectedRoleId: string | null;
  setSelectedFamilyId: (familyId: string | null) => void;
  setSelectedRoleId: (roleId: string | null) => void;
  reset: () => void;
  canReassign: boolean;
  validationErrors: string[];
  buildRequest: (etag: string) => UserReassignRequest | null;
  filteredFamilies: FamilyResponse[];
  filteredRoles: Array<{ id: string; name: string }>;
}

/**
 * User reassignment business logic hook
 * Handles validation, state management, and request building
 */
export function useUserReassignment(
  params: UseUserReassignmentParams
): UseUserReassignmentReturn {
  const { user, availableFamilies, availableRoles } = params;

  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Filter out soft-deleted families and current family
  const filteredFamilies = useMemo(() => {
    if (!user) return availableFamilies;
    
    return availableFamilies.filter(
      (family) => 
        family.status === "Active" && 
        family.id !== user.family_id &&
        !family.is_del
    );
  }, [availableFamilies, user]);

  // Filter out superadmin role (SuperAdmin cannot assign superadmin to others)
  const filteredRoles = useMemo(() => {
    return availableRoles.filter((role) => role.name.toLowerCase() !== "superadmin");
  }, [availableRoles]);

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!user) {
      errors.push("User is required");
      return errors;
    }

    if (!selectedFamilyId) {
      errors.push("Target family is required");
    } else {
      // Check if target family is soft-deleted
      const targetFamily = availableFamilies.find((f) => f.id === selectedFamilyId);
      if (targetFamily && (targetFamily.is_del || targetFamily.status === "SoftDeleted")) {
        errors.push("Cannot reassign user to a soft-deleted family");
      }

      // Check if reassigning to same family
      if (selectedFamilyId === user.family_id) {
        errors.push("User is already in this family");
      }
    }

    // If role is provided, validate it exists
    if (selectedRoleId) {
      const roleExists = availableRoles.some((r) => r.id === selectedRoleId);
      if (!roleExists) {
        errors.push("Selected role does not exist");
      }
    }

    // Check if user's current family is soft-deleted (cannot reassign from deleted family)
    const currentFamily = availableFamilies.find((f) => f.id === user.family_id);
    if (currentFamily && (currentFamily.is_del || currentFamily.status === "SoftDeleted")) {
      errors.push("Cannot reassign user from a soft-deleted family");
    }

    return errors;
  }, [user, selectedFamilyId, selectedRoleId, availableFamilies, availableRoles]);

  const canReassign = useMemo(() => {
    return validationErrors.length === 0 && selectedFamilyId !== null;
  }, [validationErrors, selectedFamilyId]);

  const reset = useCallback(() => {
    setSelectedFamilyId(null);
    setSelectedRoleId(null);
  }, []);

  const buildRequest = useCallback((etag: string): UserReassignRequest | null => {
    if (!canReassign || !selectedFamilyId) {
      return null;
    }

    return {
      family_id: selectedFamilyId,
      role_id: selectedRoleId || null,
    };
  }, [canReassign, selectedFamilyId, selectedRoleId]);

  return {
    selectedFamilyId,
    selectedRoleId,
    setSelectedFamilyId,
    setSelectedRoleId,
    reset,
    canReassign,
    validationErrors,
    buildRequest,
    filteredFamilies,
    filteredRoles,
  };
}

