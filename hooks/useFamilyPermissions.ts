/**
 * Family Permissions Business Logic Hook
 * Based on R5 rules
 * Encapsulates permission checking logic for family operations
 */

import { useMemo } from "react";

interface UseFamilyPermissionsParams {
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  familyStatus: "Active" | "SoftDeleted" | null;
}

interface UseFamilyPermissionsReturn {
  canCreateFamily: boolean;
  canEditFamily: boolean;
  canSoftDeleteFamily: boolean;
  canViewFamilyDetails: boolean;
  isActionDisabled: boolean;
}

/**
 * Family permissions business logic hook
 * Calculates what actions the current user can perform on families
 */
export function useFamilyPermissions(
  params: UseFamilyPermissionsParams
): UseFamilyPermissionsReturn {
  const { currentUserRole, familyStatus } = params;

  const canCreateFamily = useMemo(() => {
    return currentUserRole === "superadmin";
  }, [currentUserRole]);

  const canEditFamily = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    return currentUserRole === "superadmin";
  }, [currentUserRole, familyStatus]);

  const canSoftDeleteFamily = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    return currentUserRole === "superadmin";
  }, [currentUserRole, familyStatus]);

  const canViewFamilyDetails = useMemo(() => {
    // All authenticated users can view their own family
    return currentUserRole !== null;
  }, [currentUserRole]);

  const isActionDisabled = useMemo(() => {
    return familyStatus === "SoftDeleted" || currentUserRole !== "superadmin";
  }, [familyStatus, currentUserRole]);

  return {
    canCreateFamily,
    canEditFamily,
    canSoftDeleteFamily,
    canViewFamilyDetails,
    isActionDisabled,
  };
}

