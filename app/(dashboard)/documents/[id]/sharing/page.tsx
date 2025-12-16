/**
 * Document Sharing Page
 * Route: /documents/[id]/sharing
 * Based on R11 rules
 * 
 * Access Rules:
 * - Only Owner and FamilyAdmin can access (document-level permissions checked in container)
 * - All authenticated users can access route (Member, FamilyAdmin)
 * - Document-level permissions (Owner, FamilyAdmin) are checked in the container
 * - Soft-deleted documents are handled in the container
 */

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

// Lazy load document sharing container for code splitting
const DocumentSharingContainer = dynamic(
  () => import("@/modules/f004-sharing/containers/DocumentSharingContainer").then(
    (mod) => ({ default: mod.DocumentSharingContainer })
  ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-gray-500">Loading sharing settings...</div>
    ),
  }
);

export default function DocumentSharingPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <DocumentSharingContainer />
    </RouteGuard>
  );
}

