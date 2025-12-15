/**
 * User List Container Component for SuperAdmin viewing users in a specific family
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserList } from "../components/UserList";
import { useUserList } from "../hooks/useUsers";
import { useUserPermissions } from "../hooks/useUserPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useModalState } from "@/hooks/useModalState";
import { InviteUserFormContainerForFamily } from "../forms/inviteUser.form.container.forFamily";
import { Modal } from "@/components/ui/modal";
import { userRoutes } from "@/utils/routing";
import { useFamily } from "../hooks/useFamilies";

/**
 * User list container component for SuperAdmin viewing users in a specific family
 * Handles business logic and API calls via hooks
 */
export function UserListContainerForFamily() {
  const router = useRouter();
  const params = useParams();
  const familyId = params?.family_id as string;
  const { user } = useAuthContext();
  const { data: familyData } = useFamily(familyId);
  const { data: usersData, isLoading } = useUserList(familyId || null);
  const { canInviteUsers } = useUserPermissions({
    currentUserRole: user?.role || null,
    currentUserId: user?.id || null,
    familyStatus: familyData?.data?.data?.status || null,
  });
  const { isOpen, open, close } = useModalState();

  const handleInviteUser = useCallback(() => {
    open();
  }, [open]);

  const handleUserClick = useCallback(
    (userId: string) => {
      router.push(userRoutes.detailForFamily(familyId, userId));
    },
    [router, familyId]
  );

  const handleInviteSuccess = useCallback(() => {
    close();
  }, [close]);

  return (
    <>
      <UserList
        users={usersData?.data?.items || []}
        isLoading={isLoading}
        onInviteUser={handleInviteUser}
        canInviteUsers={canInviteUsers}
        onUserClick={handleUserClick}
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Invite User"
      >
        <div className="p-1">
          <InviteUserFormContainerForFamily
            familyId={familyId}
            onSuccess={handleInviteSuccess}
            onCancel={close}
          />
        </div>
      </Modal>
    </>
  );
}

