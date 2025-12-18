/**
 * SuperAdmin Soft-Deleted Families Page
 * Route: /superadmin/deleted/families
 * Based on R11 routing rules
 */

"use client";

import React from "react";
import { SuperAdminSoftDeletedFamilies } from "@/modules/f007-superadmin/components/SuperAdminSoftDeletedFamilies";
import { useFamilyList } from "@/modules/f007-superadmin/hooks/useSuperAdminFamilies";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function SuperAdminSoftDeletedFamiliesPage() {
  const router = useRouter();
  const { data: familiesData, isLoading } = useFamilyList({
    status: ["SoftDeleted"],
  });

  const handleViewDetail = useCallback(
    (familyId: string) => {
      router.push(`/superadmin/families/${familyId}`);
    },
    [router]
  );

  return (
    <SuperAdminSoftDeletedFamilies
      families={familiesData?.data?.items || []}
      isLoading={isLoading}
      onViewDetail={handleViewDetail}
    />
  );
}

