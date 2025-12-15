/**
 * Family Detail Page
 * Route: /families/[family_id]
 * Based on R11 rules
 * 
 * Access Rules:
 * - SuperAdmin: Can view any family
 * - FamilyAdmin: Can view own family only (read-only for family management, can manage users)
 * - Member: Can view own family only (completely read-only)
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { FamilyDetailContainer } from "@/modules/f001-identity/containers/FamilyDetailContainer";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function FamilyDetailPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.SuperAdmin, UserRole.FamilyAdmin, UserRole.Member]}
    >
      <FamilyDetailContainer />
    </RouteGuard>
  );
}

