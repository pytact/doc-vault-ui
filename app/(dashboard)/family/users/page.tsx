/**
 * User List Page
 * Route: /family/users
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserListContainer } from "@/modules/f001-identity/containers/UserListContainer";

export default function UserListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      requiredRoles={["familyadmin", "superadmin"]}
    >
      <UserListContainer />
    </RouteGuard>
  );
}

