/**
 * SuperAdmin Family List Container
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminFamilyList } from "../components/SuperAdminFamilyList";
import { useFamilyList } from "../hooks/useSuperAdminFamilies";
import { useSuperAdminFamilyFilters } from "../hooks/useSuperAdminFamilyFilters";
import { usePagination } from "@/hooks/usePagination";
import { useModalState } from "@/hooks/useModalState";
import { Modal } from "@/components/ui/modal";
import { FamilyFormContainer } from "@/modules/f001-identity/forms/family.form.container";

/**
 * SuperAdmin Family List container component
 * Handles business logic and API calls via hooks
 */
export function SuperAdminFamilyListContainer() {
  const router = useRouter();
  const { isOpen, open, close } = useModalState();
  const filters = useSuperAdminFamilyFilters();
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 20,
  });

  // Build list params from filters and pagination
  const listParams = filters.buildListParams(
    (pagination.page - 1) * pagination.pageSize,
    pagination.pageSize
  );

  const { data: familiesData, isLoading, error } = useFamilyList(listParams);

  const handleCreateFamily = useCallback(() => {
    open();
  }, [open]);

  const handleViewDeleted = useCallback(() => {
    router.push("/superadmin/deleted/families");
  }, [router]);

  const handleCreateFamilySuccess = useCallback(() => {
    close();
  }, [close]);

  if (error) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
        <p className="text-sm font-medium text-danger-800">
          Error loading families
        </p>
        <p className="mt-1 text-sm text-danger-600">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  return (
    <>
      <SuperAdminFamilyList
        families={familiesData?.data?.items || []}
        isLoading={isLoading}
        onCreateFamily={handleCreateFamily}
        onViewDeleted={handleViewDeleted}
      />

      <Modal isOpen={isOpen} onClose={close} title="Create Family" size="md">
        <FamilyFormContainer onSuccess={handleCreateFamilySuccess} onCancel={close} />
      </Modal>
    </>
  );
}

