/**
 * User List Page for SuperAdmin (All Users)
 * Route: /superadmin/users
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserListContainerAll } from "@/modules/f001-identity/containers/UserListContainerAll";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function SuperAdminUserListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.SuperAdmin]}
    >
      <UserListContainerAll />
    </RouteGuard>
  );
}

