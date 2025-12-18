/**
 * SuperAdmin Family List Component
 * SCR_SA_FAMILY_LIST - Wrapper around existing FamilyList component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FamilyList } from "@/modules/f001-identity/components/FamilyList";
import { FamilyResponse } from "../types/responses/family";

interface SuperAdminFamilyListProps {
  families: FamilyResponse[];
  isLoading?: boolean;
  onCreateFamily: () => void;
  onViewDeleted?: () => void;
}

/**
 * SuperAdmin Family List UI component
 * Reuses existing FamilyList component with SuperAdmin-specific additions
 * Memoized to prevent unnecessary re-renders
 */
export const SuperAdminFamilyList = React.memo(function SuperAdminFamilyList({
  families,
  isLoading = false,
  onCreateFamily,
  onViewDeleted,
}: SuperAdminFamilyListProps) {
  return (
    <div className="space-y-4">
      {onViewDeleted && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onViewDeleted}>
            View Deleted Families
          </Button>
        </div>
      )}
      <FamilyList
        families={families}
        isLoading={isLoading}
        onCreateFamily={onCreateFamily}
        canCreateFamily={true}
      />
    </div>
  );
});

