/**
 * User List Page for SuperAdmin
 * Route: /families/[family_id]/users
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserListContainerForFamily } from "@/modules/f001-identity/containers/UserListContainerForFamily";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function FamilyUserListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.SuperAdmin]}
    >
      <UserListContainerForFamily />
    </RouteGuard>
  );
}

