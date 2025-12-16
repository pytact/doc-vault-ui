/**
 * Document Permissions Business Logic Hook
 * Based on R5 rules
 * Encapsulates permission checking logic for document operations
 */

import { useMemo } from "react";
import { DocumentPermission } from "../types/responses/document";

interface UseDocumentPermissionsParams {
  documentPermission: DocumentPermission | null | undefined;
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  isDocumentDeleted: boolean;
  hasFile: boolean;
  isOwner: boolean; // Whether current user is the document owner
}

interface UseDocumentPermissionsReturn {
  canCreateDocument: boolean;
  canEditDocument: boolean;
  canDeleteDocument: boolean;
  canViewDocument: boolean;
  canPreviewDocument: boolean;
  canDownloadDocument: boolean;
  canUploadFile: boolean;
  canReplaceFile: boolean;
  canListDocuments: boolean;
}

/**
 * Document permissions business logic hook
 * Calculates what actions the current user can perform on documents
 * Based on F-003 API spec permission matrix
 */
export function useDocumentPermissions(
  params: UseDocumentPermissionsParams
): UseDocumentPermissionsReturn {
  const {
    documentPermission,
    currentUserRole,
    isDocumentDeleted,
    hasFile,
    isOwner,
  } = params;

  const canCreateDocument = useMemo(() => {
    // Member (Owner) and FamilyAdmin can create documents
    return currentUserRole === "member" || currentUserRole === "familyadmin";
  }, [currentUserRole]);

  const canEditDocument = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!documentPermission) return false;
    
    // Owner, Editor, and FamilyAdmin can edit metadata
    return (
      documentPermission === "owner" ||
      documentPermission === "editor" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted]);

  const canDeleteDocument = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!documentPermission) return false;
    
    // Only Owner and FamilyAdmin can delete documents
    return (
      documentPermission === "owner" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted]);

  const canViewDocument = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!documentPermission) return false;
    
    // Owner, Editor, Viewer, and FamilyAdmin can view documents
    return (
      documentPermission === "owner" ||
      documentPermission === "editor" ||
      documentPermission === "viewer" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted]);

  const canPreviewDocument = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!hasFile) return false;
    if (!documentPermission) return false;
    
    // Owner, Editor, Viewer, and FamilyAdmin can preview documents
    return (
      documentPermission === "owner" ||
      documentPermission === "editor" ||
      documentPermission === "viewer" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted, hasFile]);

  const canDownloadDocument = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!hasFile) return false;
    if (!documentPermission) return false;
    
    // Owner, Editor, Viewer, and FamilyAdmin can download documents
    return (
      documentPermission === "owner" ||
      documentPermission === "editor" ||
      documentPermission === "viewer" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted, hasFile]);

  const canUploadFile = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!documentPermission) return false;
    
    // Only Owner and FamilyAdmin can upload files (for new documents)
    return (
      documentPermission === "owner" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted]);

  const canReplaceFile = useMemo(() => {
    if (isDocumentDeleted) return false;
    if (!documentPermission) return false;
    
    // Owner, Editor, and FamilyAdmin can replace files
    return (
      documentPermission === "owner" ||
      documentPermission === "editor" ||
      currentUserRole === "familyadmin"
    );
  }, [documentPermission, currentUserRole, isDocumentDeleted]);

  const canListDocuments = useMemo(() => {
    // Member (Owner), Viewer, Editor, and FamilyAdmin can list documents
    return (
      currentUserRole === "member" ||
      currentUserRole === "familyadmin"
      // Note: Viewer and Editor permissions are determined by F-004 sharing,
      // but they can still list documents they have access to
    );
  }, [currentUserRole]);

  return {
    canCreateDocument,
    canEditDocument,
    canDeleteDocument,
    canViewDocument,
    canPreviewDocument,
    canDownloadDocument,
    canUploadFile,
    canReplaceFile,
    canListDocuments,
  };
}

