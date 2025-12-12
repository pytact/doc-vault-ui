/**
 * Family Detail Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FamilyDetail } from "../components/FamilyDetail";
import { useFamily } from "@/hooks/useFamilies";
import { useFamilyPermissions } from "@/hooks/useFamilyPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useModalState } from "@/hooks/useModalState";
import { FamilyFormContainer } from "../forms/family.form.container";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { familyRoutes } from "@/utils/routing";

/**
 * Family detail container component
 * Handles business logic and API calls via hooks
 */
export function FamilyDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const familyId = params?.family_id as string;
  const { user } = useAuthContext();
  const { data: familyData, isLoading } = useFamily(familyId);
  const { canEditFamily, canSoftDeleteFamily } = useFamilyPermissions({
    currentUserRole: user?.role || null,
    family: familyData?.data,
  });
  const editModal = useModalState();
  const softDeleteModal = useModalState();

  // Redirect if family not found or soft-deleted
  useEffect(() => {
    if (!isLoading && (!familyData?.data || familyData.data.status === "SoftDeleted")) {
      router.push(familyRoutes.notAccessible(familyId));
    }
  }, [isLoading, familyData, familyId, router]);

  if (isLoading) {
    return <div>Loading family...</div>;
  }

  if (!familyData?.data || familyData.data.status === "SoftDeleted") {
    return null;
  }

  const handleEditFamily = useCallback(() => {
    editModal.open();
  }, [editModal]);

  const handleSoftDelete = useCallback(() => {
    softDeleteModal.open();
  }, [softDeleteModal]);

  const handleEditSuccess = useCallback(() => {
    editModal.close();
  }, [editModal]);

  return (
    <>
      <FamilyDetail
        family={familyData.data}
        canEditFamily={canEditFamily}
        canSoftDeleteFamily={canSoftDeleteFamily}
        onEditFamily={handleEditFamily}
        onSoftDeleteFamily={handleSoftDelete}
      />

      <Modal open={editModal.isOpen} onOpenChange={editModal.close}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Family Name</ModalTitle>
          </ModalHeader>
          <FamilyFormContainer
            familyId={familyId}
            onSuccess={handleEditSuccess}
            onCancel={editModal.close}
          />
        </ModalContent>
      </Modal>

      {/* TODO: Add SoftDeleteFamilyModal component */}
    </>
  );
}

