/**
 * Document Edit Page
 * Route: /documents/[id]/edit
 * Based on R11 rules
 * 
 * Access Rules:
 * - All authenticated users can access (Member, FamilyAdmin)
 * - Document-level permissions (Owner, Editor) are checked in the container
 * - Soft-deleted documents are handled in the container
 */

"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import { useParams, useRouter } from "next/navigation";
import { documentRoutes } from "@/utils/routing";

// Lazy load document edit form container for code splitting
const DocumentEditFormContainer = dynamic(
  () => import("@/modules/f003-documents/forms/DocumentEditFormContainer").then(
    (mod) => ({ default: mod.DocumentEditFormContainer })
  ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-gray-500">Loading form...</div>
    ),
  }
);

export default function DocumentEditPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;

  const handleSuccess = useCallback(() => {
    if (documentId) {
      router.push(documentRoutes.detail(documentId));
    } else {
      router.push(documentRoutes.list);
    }
  }, [router, documentId]);

  const handleCancel = useCallback(() => {
    if (documentId) {
      router.push(documentRoutes.detail(documentId));
    } else {
      router.push(documentRoutes.list);
    }
  }, [router, documentId]);

  if (!documentId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Document ID is required
      </div>
    );
  }

  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <DocumentEditFormContainer
        documentId={documentId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </RouteGuard>
  );
}

