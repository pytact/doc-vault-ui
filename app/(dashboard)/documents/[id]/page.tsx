/**
 * Document Detail Page
 * Route: /documents/[id]
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

// Lazy load document detail container for code splitting
const DocumentDetailContainer = dynamic(
  () => import("@/modules/f003-documents/containers/DocumentDetailContainer").then(
    (mod) => ({ default: mod.DocumentDetailContainer })
  ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-gray-500">Loading document...</div>
    ),
  }
);

export default function DocumentDetailPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <DocumentDetailContainer />
    </RouteGuard>
  );
}

