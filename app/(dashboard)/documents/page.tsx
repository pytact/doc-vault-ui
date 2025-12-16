/**
 * Document List Page
 * Route: /documents
 * Based on R11 rules
 * 
 * Access Rules:
 * - Member (Owner): Can list own documents
 * - FamilyAdmin: Can list all family documents
 * - All authenticated users can access (permission filtering happens at document level)
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { DocumentListContainer } from "@/modules/f003-documents/containers/DocumentListContainer";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function DocumentListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <DocumentListContainer />
    </RouteGuard>
  );
}

