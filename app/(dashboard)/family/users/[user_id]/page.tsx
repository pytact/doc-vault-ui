/**
 * User Detail Page
 * Route: /family/users/[user_id]
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserDetailContainer } from "@/modules/f001-identity/containers/UserDetailContainer";

export default function UserDetailPage() {
  return (
    <RouteGuard
      requireAuth={true}
      requiredRoles={["familyadmin", "superadmin"]}
    >
      <UserDetailContainer />
    </RouteGuard>
  );
}

