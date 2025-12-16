/**
 * User List Container Component for SuperAdmin (All Users)
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { UserList } from "../components/UserList";
import { useUserListAll, useUser } from "../hooks/useUsers";
import { useUserPermissions } from "../hooks/useUserPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { userRoutes } from "@/utils/routing";
import { UserService } from "@/services/users/user.service";
import { useNotificationContext } from "@/contexts/notification.context";

/**
 * User list container component for SuperAdmin viewing all users
 * Handles business logic and API calls via hooks
 */
export function UserListContainerAll() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { addNotification } = useNotificationContext();
  const { data: usersData, isLoading } = useUserListAll();
  const { canInviteUsers } = useUserPermissions({
    currentUserRole: user?.role || null,
    currentUserId: user?.id || null,
  });
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Handle user click - use family_id from response if available, otherwise show error
  const handleUserClick = useCallback(async (userId: string) => {
    if (loadingUserId === userId) return; // Prevent double clicks
    
    setLoadingUserId(userId);
    try {
      const userItem = usersData?.data?.items?.find(u => u.id === userId);
      const familyId = userItem?.family_id;
      
      if (familyId) {
        const route = userRoutes.detailForFamily(familyId, userId);
        router.push(route);
      } else {
        addNotification({
          type: "error",
          message: "Unable to determine user's family. The user list response must include family_id. Please view the user from their family's user list.",
          title: "Navigation Error",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to navigate to user details. Please try again.",
        title: "Error",
      });
    } finally {
      setLoadingUserId(null);
    }
  }, [router, usersData, addNotification, loadingUserId]);

  return (
    <UserList
      users={usersData?.data?.items || []}
      isLoading={isLoading}
      onInviteUser={() => {}} // SuperAdmin can't invite from all users list
      canInviteUsers={false} // Disable invite for all users view
      title="All Users"
      description="View and manage all users across all families"
      onUserClick={handleUserClick}
    />
  );
}

