/**
 * Document Detail Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for document detail display
 */

import { useMemo } from "react";
import { DocumentResponse } from "../types/responses/document";
import { format } from "date-fns";

interface TransformedDocumentDetail extends DocumentResponse {
  createdAtFormatted: string;
  updatedAtFormatted: string;
  expiryDateFormatted: string | null;
  fileSizeFormatted: string | null;
  hasFile: boolean;
  permissionLabel: string;
  isExpired: boolean;
  daysUntilExpiry: number | null;
  detailsJsonFormatted: string | null; // Pretty-printed JSON string
  categoryName?: string; // Will be populated from taxonomy cache
  subcategoryName?: string; // Will be populated from taxonomy cache
}

interface UseDocumentDetailTransformParams {
  document: DocumentResponse | undefined;
  categoryMap?: Map<string, string>; // Map of category_id -> category_name
  subcategoryMap?: Map<string, string>; // Map of subcategory_id -> subcategory_name
  currentUserRole?: "superadmin" | "familyadmin" | "member" | null; // Current user's role for permission checks
}

interface UseDocumentDetailTransformReturn {
  transformedDocument: TransformedDocumentDetail | null;
  canEdit: boolean;
  canDelete: boolean;
  canPreview: boolean;
  canDownload: boolean;
  canReplaceFile: boolean;
}

/**
 * Format file size in bytes to human-readable format
 */
function formatFileSize(bytes: number | null): string | null {
  if (!bytes) return null;
  
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format permission enum to display label
 */
function formatPermissionLabel(permission: "owner" | "editor" | "viewer"): string {
  switch (permission) {
    case "owner":
      return "Owner";
    case "editor":
      return "Editor";
    case "viewer":
      return "Viewer";
    default:
      return "Unknown";
  }
}

/**
 * Check if document is expired
 */
function isExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const now = new Date();
  return now > expiry;
}

/**
 * Calculate days until expiry (negative if expired)
 */
function calculateDaysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Pretty-print JSON object to string
 */
function formatJsonDetails(detailsJson: Record<string, any> | null): string | null {
  if (!detailsJson) return null;
  try {
    return JSON.stringify(detailsJson, null, 2);
  } catch (error) {
    return null;
  }
}

/**
 * Document detail transformation hook
 * Transforms document detail data with derived fields, permissions, and formatting
 */
export function useDocumentDetailTransform(
  params: UseDocumentDetailTransformParams
): UseDocumentDetailTransformReturn {
  const { document, categoryMap, subcategoryMap, currentUserRole } = params;

  const transformedDocument = useMemo(() => {
    if (!document) return null;

    // Format dates
    const createdAtFormatted = document.created_at
      ? format(new Date(document.created_at), "MMM dd, yyyy HH:mm")
      : "";
    const updatedAtFormatted = document.updated_at
      ? format(new Date(document.updated_at), "MMM dd, yyyy HH:mm")
      : "";
    const expiryDateFormatted = document.expiry_date
      ? format(new Date(document.expiry_date), "MMM dd, yyyy")
      : null;

    // Format file size
    const fileSizeFormatted = formatFileSize(document.file_size);

    // Check if file exists
    const hasFile = document.file_path !== null && document.file_size !== null;

    // Format permission label
    const permissionLabel = formatPermissionLabel(document.permission);

    // Check expiry status
    const isExpiredValue = isExpired(document.expiry_date);
    const daysUntilExpiry = calculateDaysUntilExpiry(document.expiry_date);

    // Format JSON details
    const detailsJsonFormatted = formatJsonDetails(document.details_json);

    // Get category and subcategory names from maps
    const categoryName = categoryMap?.get(document.category_id);
    const subcategoryName = subcategoryMap?.get(document.subcategory_id);

    return {
      ...document,
      createdAtFormatted,
      updatedAtFormatted,
      expiryDateFormatted,
      fileSizeFormatted,
      hasFile,
      permissionLabel,
      isExpired: isExpiredValue,
      daysUntilExpiry,
      detailsJsonFormatted,
      categoryName,
      subcategoryName,
    };
  }, [document, categoryMap, subcategoryMap]);

  const canEdit = useMemo(() => {
    if (!document) return false;
    if (document.is_del) return false;
    return (
      document.permission === "owner" ||
      document.permission === "editor"
    );
  }, [document]);

  const canDelete = useMemo(() => {
    if (!document) {
      console.log("useDocumentDetailTransform.canDelete - No document");
      return false;
    }
    if (document.is_del) {
      console.log("useDocumentDetailTransform.canDelete - Document is deleted");
      return false;
    }
    // Owner, Editor, and FamilyAdmin can delete documents
    // Members with owner permission can delete their own documents
    // FamilyAdmin can delete any document
    const hasOwnerPermission = document.permission === "owner";
    const hasEditorPermission = document.permission === "editor";
    const isFamilyAdmin = currentUserRole === "familyadmin";
    
    const canDeleteResult = hasOwnerPermission || hasEditorPermission || isFamilyAdmin;
    
    console.log("useDocumentDetailTransform.canDelete - Check:", {
      documentPermission: document.permission,
      currentUserRole,
      hasOwnerPermission,
      hasEditorPermission,
      isFamilyAdmin,
      canDelete: canDeleteResult,
    });
    
    return canDeleteResult;
  }, [document, currentUserRole]);

  const canPreview = useMemo(() => {
    if (!document) return false;
    if (document.is_del) return false;
    // Don't check hasFile - file might be accessible via endpoint even if metadata shows null
    // The endpoint will handle the error if file doesn't exist
    return (
      document.permission === "owner" ||
      document.permission === "editor" ||
      document.permission === "viewer"
    );
  }, [document]);

  const canDownload = useMemo(() => {
    if (!document) return false;
    if (document.is_del) return false;
    // Don't check hasFile - file might be accessible via endpoint even if metadata shows null
    // The endpoint will handle the error if file doesn't exist
    return (
      document.permission === "owner" ||
      document.permission === "editor" ||
      document.permission === "viewer"
    );
  }, [document]);

  const canReplaceFile = useMemo(() => {
    if (!document) return false;
    if (document.is_del) return false;
    return (
      document.permission === "owner" ||
      document.permission === "editor"
    );
  }, [document]);

  return {
    transformedDocument,
    canEdit,
    canDelete,
    canPreview,
    canDownload,
    canReplaceFile,
  };
}

