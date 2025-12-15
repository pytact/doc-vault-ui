/**
 * User List Page
 * Route: /family/users
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserListContainer } from "@/modules/f001-identity/containers/UserListContainer";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function UserListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.FamilyAdmin, UserRole.SuperAdmin]}
    >
      <UserListContainer />
    </RouteGuard>
  );
}

