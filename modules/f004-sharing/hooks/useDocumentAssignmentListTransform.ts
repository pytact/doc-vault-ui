/**
 * Document Assignment List Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for document assignment list display
 */

import { useMemo } from "react";
import { DocumentAssignmentResponse } from "../types/responses/document-assignment";
import { format } from "date-fns";

interface TransformedAssignmentItem extends DocumentAssignmentResponse {
  assignedAtFormatted: string;
  updatedAtFormatted: string;
  accessTypeLabel: string;
  accessTypeColor: "blue" | "green" | "gray";
  userDisplayName: string;
  userInitials: string;
}

interface UseDocumentAssignmentListTransformParams {
  assignments: DocumentAssignmentResponse[] | undefined;
  documentOwnerId?: string | null; // Document owner ID to filter out
}

interface UseDocumentAssignmentListTransformReturn {
  transformedAssignments: TransformedAssignmentItem[];
  totalAssignments: number;
  viewerCount: number;
  editorCount: number;
  activeAssignmentsCount: number;
}

/**
 * Format access type enum to display label
 */
function formatAccessTypeLabel(accessType: "viewer" | "editor"): string {
  switch (accessType) {
    case "viewer":
      return "Viewer";
    case "editor":
      return "Editor";
    default:
      return "Unknown";
  }
}

/**
 * Get access type color for UI display
 */
function getAccessTypeColor(accessType: "viewer" | "editor"): "blue" | "green" | "gray" {
  switch (accessType) {
    case "viewer":
      return "blue";
    case "editor":
      return "green";
    default:
      return "gray";
  }
}

/**
 * Get user display name (name or email fallback)
 */
function getUserDisplayName(name: string, email: string): string {
  return name || email || "Unknown User";
}

/**
 * Get user initials for avatar display
 */
function getUserInitials(name: string, email: string): string {
  const displayName = getUserDisplayName(name, email);
  const parts = displayName.trim().split(/\s+/);
  
  if (parts.length >= 2) {
    // First letter of first name + first letter of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length > 0) {
    // First two letters of single name
    return parts[0].substring(0, 2).toUpperCase();
  } else if (email) {
    // Use first two letters of email
    return email.substring(0, 2).toUpperCase();
  }
  
  return "??";
}

/**
 * Document assignment list transformation hook
 * Transforms assignment list data with derived fields and formatting
 */
export function useDocumentAssignmentListTransform(
  params: UseDocumentAssignmentListTransformParams
): UseDocumentAssignmentListTransformReturn {
  const { assignments = [], documentOwnerId } = params;

  const transformedAssignments = useMemo(() => {
    // Filter out the document owner from the assignments list
    // Owner already has full access and shouldn't be shown in sharing list
    const filteredAssignments = documentOwnerId
      ? assignments.filter(
          (assignment) => assignment.assign_to_user_id !== documentOwnerId
        )
      : assignments;

    return filteredAssignments.map((assignment) => {
      // Format dates
      const assignedAtFormatted = assignment.assigned_at
        ? format(new Date(assignment.assigned_at), "MMM dd, yyyy 'at' HH:mm")
        : "";
      const updatedAtFormatted = assignment.updated_at
        ? format(new Date(assignment.updated_at), "MMM dd, yyyy 'at' HH:mm")
        : "";

      // Format access type label
      const accessTypeLabel = formatAccessTypeLabel(assignment.access_type);

      // Get access type color
      const accessTypeColor = getAccessTypeColor(assignment.access_type);

      // Get user display name
      const userDisplayName = getUserDisplayName(
        assignment.user.name,
        assignment.user.email
      );

      // Get user initials
      const userInitials = getUserInitials(
        assignment.user.name,
        assignment.user.email
      );

      return {
        ...assignment,
        assignedAtFormatted,
        updatedAtFormatted,
        accessTypeLabel,
        accessTypeColor,
        userDisplayName,
        userInitials,
      };
    });
  }, [assignments, documentOwnerId]);

  const totalAssignments = useMemo(() => {
    return transformedAssignments.length;
  }, [transformedAssignments]);

  const viewerCount = useMemo(() => {
    return transformedAssignments.filter(
      (assignment) => assignment.access_type === "viewer"
    ).length;
  }, [transformedAssignments]);

  const editorCount = useMemo(() => {
    return transformedAssignments.filter(
      (assignment) => assignment.access_type === "editor"
    ).length;
  }, [transformedAssignments]);

  const activeAssignmentsCount = useMemo(() => {
    return transformedAssignments.filter(
      (assignment) => !assignment.is_del
    ).length;
  }, [transformedAssignments]);

  return {
    transformedAssignments,
    totalAssignments,
    viewerCount,
    editorCount,
    activeAssignmentsCount,
  };
}

