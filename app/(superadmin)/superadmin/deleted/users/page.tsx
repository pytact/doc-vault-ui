/**
 * SuperAdmin Soft-Deleted Users Page
 * Route: /superadmin/deleted/users
 * Based on R11 routing rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { SuperAdminSoftDeletedUsers } from "@/modules/f007-superadmin/components/SuperAdminSoftDeletedUsers";
import { useUserListAll } from "@/modules/f001-identity/hooks/useUsers";
import { useRouter } from "next/navigation";
import type { UserListResponseItem as F001UserListResponseItem } from "@/modules/f001-identity/types/responses/user";
import type { UserListResponseItem } from "@/modules/f007-superadmin/types/responses/user";

export default function SuperAdminSoftDeletedUsersPage() {
  const router = useRouter();
  const { data: usersData, isLoading } = useUserListAll({
    status: "SoftDeleted",
  });

  // Adapt f001-identity response items to SuperAdmin format
  const adaptedUsers: UserListResponseItem[] = useMemo(() => {
    return (usersData?.data?.items || []).map((item: F001UserListResponseItem) => ({
      ...item,
      family_id: item.family_id || "", // Ensure family_id is always a string
    })) as UserListResponseItem[];
  }, [usersData]);

  const handleReactivate = useCallback(
    (userId: string) => {
      // Navigate to user detail page where reactivation can be done
      router.push(`/superadmin/users/${userId}`);
    },
    [router]
  );

  const handleViewDetail = useCallback(
    (userId: string) => {
      router.push(`/superadmin/users/${userId}`);
    },
    [router]
  );

  const canReactivate = useCallback((user: UserListResponseItem) => {
    // User can be reactivated if their family is not soft-deleted
    return user.family_status === "Active";
  }, []);

  return (
    <SuperAdminSoftDeletedUsers
      users={adaptedUsers}
      isLoading={isLoading}
      onReactivate={handleReactivate}
      onViewDetail={handleViewDetail}
      canReactivate={canReactivate}
    />
  );
}

