/**
 * Family List Page
 * Route: /families
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { FamilyListContainer } from "@/modules/f001-identity/containers/FamilyListContainer";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function FamilyListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.SuperAdmin]}
    >
      <FamilyListContainer />
    </RouteGuard>
  );
}

