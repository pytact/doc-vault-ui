/**
 * Family Permissions Business Logic Hook
 * Based on R5 rules
 * Encapsulates permission checking logic for family operations
 */

import { useMemo } from "react";
import { UserPermissions } from "../types/responses/auth";

interface UseFamilyPermissionsParams {
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  familyStatus: "Active" | "SoftDeleted" | null;
  permissions?: UserPermissions | null;
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
 * Checks both role-based and permission-based access
 */
export function useFamilyPermissions(
  params: UseFamilyPermissionsParams
): UseFamilyPermissionsReturn {
  const { currentUserRole, familyStatus, permissions } = params;

  const canCreateFamily = useMemo(() => {
    // Check permission first, then fall back to role
    if (permissions) {
      return permissions["family:create"] === true || permissions["family:manage_all"] === true;
    }
    return currentUserRole === "superadmin";
  }, [currentUserRole, permissions]);

  const canEditFamily = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    // Check permission first, then fall back to role
    if (permissions) {
      return permissions["family:update"] === true || permissions["family:manage_all"] === true;
    }
    return currentUserRole === "superadmin";
  }, [currentUserRole, familyStatus, permissions]);

  const canSoftDeleteFamily = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    // Check permission first, then fall back to role
    if (permissions) {
      return permissions["family:delete"] === true || permissions["family:manage_all"] === true;
    }
    return currentUserRole === "superadmin";
  }, [currentUserRole, familyStatus, permissions]);

  const canViewFamilyDetails = useMemo(() => {
    // Check permission first, then fall back to role
    if (permissions) {
      return permissions["family:view_all"] === true || currentUserRole !== null;
    }
    // All authenticated users can view their own family
    return currentUserRole !== null;
  }, [currentUserRole, permissions]);

  const isActionDisabled = useMemo(() => {
    if (familyStatus === "SoftDeleted") return true;
    // Check permissions if available
    if (permissions) {
      return !(
        permissions["family:update"] === true ||
        permissions["family:delete"] === true ||
        permissions["family:manage_all"] === true
      );
    }
    return currentUserRole !== "superadmin";
  }, [familyStatus, currentUserRole, permissions]);

  return {
    canCreateFamily,
    canEditFamily,
    canSoftDeleteFamily,
    canViewFamilyDetails,
    isActionDisabled,
  };
}

