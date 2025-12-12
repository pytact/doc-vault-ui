/**
 * User Permissions Business Logic Hook
 * Based on R5 rules
 * Encapsulates permission checking logic for user operations
 */

import { useMemo } from "react";

interface UseUserPermissionsParams {
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  targetUserStatus: "Active" | "PendingActivation" | "SoftDeleted" | null;
  familyStatus: "Active" | "SoftDeleted" | null;
  targetUserId?: string | null;
  currentUserId?: string | null;
}

interface UseUserPermissionsReturn {
  canInviteUsers: boolean;
  canManageUserRoles: boolean;
  canSoftDeleteUser: boolean;
  canViewUserDetails: boolean;
  canDeleteSelf: boolean;
  isActionDisabled: boolean;
}

/**
 * User permissions business logic hook
 * Calculates what actions the current user can perform on target user
 */
export function useUserPermissions(
  params: UseUserPermissionsParams
): UseUserPermissionsReturn {
  const {
    currentUserRole,
    targetUserStatus,
    familyStatus,
    targetUserId,
    currentUserId,
  } = params;

  const canInviteUsers = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    return currentUserRole === "superadmin" || currentUserRole === "familyadmin";
  }, [currentUserRole, familyStatus]);

  const canManageUserRoles = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    if (targetUserStatus === "SoftDeleted") return false;
    return currentUserRole === "superadmin" || currentUserRole === "familyadmin";
  }, [currentUserRole, targetUserStatus, familyStatus]);

  const canSoftDeleteUser = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    if (targetUserStatus === "SoftDeleted") return false;
    if (targetUserId === currentUserId) return false; // Cannot delete self
    return currentUserRole === "superadmin" || currentUserRole === "familyadmin";
  }, [currentUserRole, targetUserStatus, familyStatus, targetUserId, currentUserId]);

  const canViewUserDetails = useMemo(() => {
    if (familyStatus === "SoftDeleted") return false;
    return currentUserRole === "superadmin" || currentUserRole === "familyadmin";
  }, [currentUserRole, familyStatus]);

  const canDeleteSelf = useMemo(() => {
    return false; // Users cannot delete themselves
  }, []);

  const isActionDisabled = useMemo(() => {
    return (
      familyStatus === "SoftDeleted" ||
      targetUserStatus === "SoftDeleted" ||
      currentUserRole === "member"
    );
  }, [familyStatus, targetUserStatus, currentUserRole]);

  return {
    canInviteUsers,
    canManageUserRoles,
    canSoftDeleteUser,
    canViewUserDetails,
    canDeleteSelf,
    isActionDisabled,
  };
}

