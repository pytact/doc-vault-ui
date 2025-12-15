/**
 * User List Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserList } from "../components/UserList";
import { useUserList } from "../hooks/useUsers";
import { useFamilyContext } from "@/contexts/family.context";
import { useUserPermissions } from "../hooks/useUserPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useModalState } from "@/hooks/useModalState";
import { InviteUserFormContainer } from "../forms/inviteUser.form.container";
import { Modal } from "@/components/ui/modal";
import { userRoutes } from "@/utils/routing";

/**
 * User list container component
 * Handles business logic and API calls via hooks
 */
export function UserListContainer() {
  const router = useRouter();
  const { familyId } = useFamilyContext();
  const { user } = useAuthContext();
  const { data: usersData, isLoading } = useUserList(familyId || null);
  const { canInviteUsers } = useUserPermissions({
    currentUserRole: user?.role || null,
    currentUserId: user?.id || null,
  });
  const { isOpen, open, close } = useModalState();

  const handleInviteUser = useCallback(() => {
    open();
  }, [open]);

  const handleUserClick = useCallback(
    (userId: string) => {
      router.push(userRoutes.detail(userId));
    },
    [router]
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
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Invite User"
      >
        <div className="p-1">
          <InviteUserFormContainer
            onSuccess={handleInviteSuccess}
            onCancel={close}
          />
        </div>
      </Modal>
    </>
  );
}

