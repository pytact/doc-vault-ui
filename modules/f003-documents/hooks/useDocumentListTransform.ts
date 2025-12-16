/**
 * Document List Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for document list display
 */

import { useMemo } from "react";
import { DocumentResponse } from "../types/responses/document";
import { format } from "date-fns";

interface TransformedDocumentItem extends DocumentResponse {
  createdAtFormatted: string;
  updatedAtFormatted: string;
  expiryDateFormatted: string | null;
  fileSizeFormatted: string | null;
  hasFile: boolean;
  permissionLabel: string;
  categoryName?: string; // Will be populated from taxonomy cache
  subcategoryName?: string; // Will be populated from taxonomy cache
}

interface UseDocumentListTransformParams {
  documents: DocumentResponse[] | undefined;
  categoryMap?: Map<string, string>; // Map of category_id -> category_name
  subcategoryMap?: Map<string, string>; // Map of subcategory_id -> subcategory_name
}

interface UseDocumentListTransformReturn {
  transformedDocuments: TransformedDocumentItem[];
  totalDocuments: number;
  documentsWithFiles: number;
  documentsWithoutFiles: number;
  expiredDocuments: number;
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
 * Document list transformation hook
 * Transforms document list data with derived fields and formatting
 */
export function useDocumentListTransform(
  params: UseDocumentListTransformParams
): UseDocumentListTransformReturn {
  const { documents = [], categoryMap, subcategoryMap } = params;

  const transformedDocuments = useMemo(() => {
    return documents.map((document) => {
      // Format dates
      const createdAtFormatted = document.created_at
        ? format(new Date(document.created_at), "MMM dd, yyyy")
        : "";
      const updatedAtFormatted = document.updated_at
        ? format(new Date(document.updated_at), "MMM dd, yyyy")
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
        categoryName,
        subcategoryName,
      };
    });
  }, [documents, categoryMap, subcategoryMap]);

  const totalDocuments = useMemo(() => {
    return transformedDocuments.length;
  }, [transformedDocuments]);

  const documentsWithFiles = useMemo(() => {
    return transformedDocuments.filter((doc) => doc.hasFile).length;
  }, [transformedDocuments]);

  const documentsWithoutFiles = useMemo(() => {
    return transformedDocuments.filter((doc) => !doc.hasFile).length;
  }, [transformedDocuments]);

  const expiredDocuments = useMemo(() => {
    return transformedDocuments.filter((doc) =>
      isExpired(doc.expiry_date)
    ).length;
  }, [transformedDocuments]);

  return {
    transformedDocuments,
    totalDocuments,
    documentsWithFiles,
    documentsWithoutFiles,
    expiredDocuments,
  };
}

