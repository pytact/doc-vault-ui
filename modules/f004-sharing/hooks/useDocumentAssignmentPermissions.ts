/**
 * Document Assignment Permissions Business Logic Hook
 * Based on R5 rules
 * Encapsulates permission checking logic for document assignment operations
 */

import { useMemo } from "react";

interface UseDocumentAssignmentPermissionsParams {
  currentUserId: string | null;
  documentOwnerId: string | null;
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  isDocumentDeleted: boolean;
  isDocumentActive: boolean;
}

interface UseDocumentAssignmentPermissionsReturn {
  canManageSharing: boolean;
  canViewAssignments: boolean;
  canCreateAssignments: boolean;
  canUpdateAssignments: boolean;
  canDeleteAssignments: boolean;
  isDocumentOwner: boolean;
  isFamilyAdmin: boolean;
}

/**
 * Document assignment permissions business logic hook
 * Calculates what actions the current user can perform on document assignments
 * Based on F-004 API spec permission matrix
 */
export function useDocumentAssignmentPermissions(
  params: UseDocumentAssignmentPermissionsParams
): UseDocumentAssignmentPermissionsReturn {
  const {
    currentUserId,
    documentOwnerId,
    currentUserRole,
    isDocumentDeleted,
    isDocumentActive,
  } = params;

  const isDocumentOwner = useMemo(() => {
    if (!currentUserId || !documentOwnerId) return false;
    return currentUserId === documentOwnerId;
  }, [currentUserId, documentOwnerId]);

  const isFamilyAdmin = useMemo(() => {
    return currentUserRole === "familyadmin";
  }, [currentUserRole]);

  const canManageSharing = useMemo(() => {
    // Can manage sharing if: (is document owner) OR (is family admin)
    return isDocumentOwner || isFamilyAdmin;
  }, [isDocumentOwner, isFamilyAdmin]);

  const canViewAssignments = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!isDocumentActive) return false;
    
    // Only Owner and FamilyAdmin can view assignments
    return canManageSharing;
  }, [isDocumentDeleted, isDocumentActive, canManageSharing]);

  const canCreateAssignments = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!isDocumentActive) return false;
    
    // Only Owner and FamilyAdmin can create assignments
    return canManageSharing;
  }, [isDocumentDeleted, isDocumentActive, canManageSharing]);

  const canUpdateAssignments = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!isDocumentActive) return false;
    
    // Only Owner and FamilyAdmin can update assignments
    return canManageSharing;
  }, [isDocumentDeleted, isDocumentActive, canManageSharing]);

  const canDeleteAssignments = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!isDocumentActive) return false;
    
    // Only Owner and FamilyAdmin can delete assignments
    return canManageSharing;
  }, [isDocumentDeleted, isDocumentActive, canManageSharing]);

  return {
    canManageSharing,
    canViewAssignments,
    canCreateAssignments,
    canUpdateAssignments,
    canDeleteAssignments,
    isDocumentOwner,
    isFamilyAdmin,
  };
}

