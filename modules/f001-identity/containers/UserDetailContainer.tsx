/**
 * User Detail Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserDetail } from "../components/UserDetail";
import { useUser } from "@/hooks/useUsers";
import { useAuthContext } from "@/contexts/auth.context";
import { useFamilyContext } from "@/contexts/family.context";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useModalState } from "@/hooks/useModalState";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { userRoutes } from "@/utils/routing";

/**
 * User detail container component
 * Handles business logic and API calls via hooks
 */
export function UserDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.user_id as string;
  const { user } = useAuthContext();
  const { familyId } = useFamilyContext();
  const { data: userData, isLoading } = useUser(familyId || null, userId);
  const { canManageRoles, canSoftDeleteUser } = useUserPermissions({
    currentUserRole: user?.role || null,
    currentUserId: user?.id || null,
    targetUser: userData?.data,
  });
  const manageRolesModal = useModalState();
  const softDeleteModal = useModalState();

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  if (!userData?.data) {
    return <div>User not found</div>;
  }

  const handleManageRoles = useCallback(() => {
    manageRolesModal.open();
  }, [manageRolesModal]);

  const handleSoftDelete = useCallback(() => {
    softDeleteModal.open();
  }, [softDeleteModal]);

  return (
    <>
      <UserDetail
        user={userData.data}
        currentUserRole={user?.role || null}
        currentUserId={user?.id || null}
        onManageRoles={handleManageRoles}
        onSoftDelete={handleSoftDelete}
      />

      {/* TODO: Add ManageRolesModal and SoftDeleteUserModal components */}
    </>
  );
}

