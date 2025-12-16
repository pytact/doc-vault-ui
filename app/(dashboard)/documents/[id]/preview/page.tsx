/**
 * Document Preview Page
 * Route: /documents/[id]/preview
 * Based on R11 rules
 * 
 * Access Rules:
 * - All authenticated users can access (Member, FamilyAdmin)
 * - Document-level permissions (Owner, Editor, Viewer) are checked in the container
 * - Soft-deleted documents are handled in the container
 */

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

// Lazy load document preview container for code splitting
const DocumentPreviewContainer = dynamic(
  () => import("@/modules/f003-documents/containers/DocumentPreviewContainer").then(
    (mod) => ({ default: mod.DocumentPreviewContainer })
  ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-gray-500">Loading preview...</div>
    ),
  }
);

export default function DocumentPreviewPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <DocumentPreviewContainer />
    </RouteGuard>
  );
}

