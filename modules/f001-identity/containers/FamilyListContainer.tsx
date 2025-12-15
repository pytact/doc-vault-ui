/**
 * Family List Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FamilyList } from "../components/FamilyList";
import { useFamilyList } from "../hooks/useFamilies";
import { useFamilyPermissions } from "../hooks/useFamilyPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useModalState } from "@/hooks/useModalState";
import { FamilyFormContainer } from "../forms/family.form.container";
import { Modal } from "@/components/ui/modal";
import { familyRoutes } from "@/utils/routing";

/**
 * Family list container component
 * Handles business logic and API calls via hooks
 */
export function FamilyListContainer() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { data: familiesData, isLoading } = useFamilyList();
  const { canCreateFamily } = useFamilyPermissions({
    currentUserRole: user?.role || null,
    familyStatus: null, // Not applicable for list view
    permissions: user?.permissions || null,
  });
  const { isOpen, open, close } = useModalState();

  const handleCreateFamily = useCallback(() => {
    open();
  }, [open]);

  const handleFamilyClick = useCallback(
    (familyId: string) => {
      router.push(familyRoutes.detail(familyId));
    },
    [router]
  );

  const handleCreateSuccess = useCallback(() => {
    close();
  }, [close]);

  // Filter out SoftDeleted families from the display
  const activeFamilies = useMemo(() => {
    return (familiesData?.data?.items || []).filter(
      (family) => family.status !== "SoftDeleted"
    );
  }, [familiesData?.data?.items]);

  return (
    <>
      <FamilyList
        families={activeFamilies}
        isLoading={isLoading}
        onCreateFamily={handleCreateFamily}
        canCreateFamily={canCreateFamily}
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Create Family"
      >
        <div className="p-1">
          <FamilyFormContainer
            onSuccess={handleCreateSuccess}
            onCancel={close}
          />
        </div>
      </Modal>
    </>
  );
}

