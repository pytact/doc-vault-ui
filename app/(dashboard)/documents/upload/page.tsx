/**
 * Document Upload Page
 * Route: /documents/upload
 * Based on R11 rules
 * 
 * Access Rules:
 * - Member (Owner): Can upload documents
 * - FamilyAdmin: Can upload documents
 * - SuperAdmin: Not applicable (documents are family-scoped)
 */

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { documentRoutes } from "@/utils/routing";

// Lazy load document upload form container for code splitting
const DocumentUploadFormContainer = dynamic(
  () => import("@/modules/f003-documents/forms/DocumentUploadFormContainer").then(
    (mod) => ({ default: mod.DocumentUploadFormContainer })
  ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-gray-500">Loading form...</div>
    ),
  }
);

export default function DocumentUploadPage() {
  const router = useRouter();

  const handleSuccess = useCallback(() => {
    router.push(documentRoutes.list);
  }, [router]);

  const handleCancel = useCallback(() => {
    router.push(documentRoutes.list);
  }, [router]);

  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <DocumentUploadFormContainer
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </RouteGuard>
  );
}

