/**
 * Family Detail Page
 * Route: /families/[family_id]
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { FamilyDetailContainer } from "@/modules/f001-identity/containers/FamilyDetailContainer";

export default function FamilyDetailPage() {
  return (
    <RouteGuard
      requireAuth={true}
      requiredRoles={["superadmin"]}
    >
      <FamilyDetailContainer />
    </RouteGuard>
  );
}

