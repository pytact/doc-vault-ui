/**
 * Family List Page
 * Route: /families
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { FamilyListContainer } from "@/modules/f001-identity/containers/FamilyListContainer";

export default function FamilyListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      requiredRoles={["superadmin"]}
    >
      <FamilyListContainer />
    </RouteGuard>
  );
}

