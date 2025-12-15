/**
 * User Detail Page for SuperAdmin
 * Route: /families/[family_id]/users/[user_id]
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserDetailContainer } from "@/modules/f001-identity/containers/UserDetailContainer";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function SuperAdminUserDetailPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.SuperAdmin]}
    >
      <UserDetailContainer />
    </RouteGuard>
  );
}

