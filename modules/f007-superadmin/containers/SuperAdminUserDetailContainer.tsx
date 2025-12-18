/**
 * SuperAdmin User Detail Container
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SuperAdminUserDetail } from "../components/SuperAdminUserDetail";
import { useUser } from "@/modules/f001-identity/hooks/useUsers";
import { useReactivateUser } from "../hooks/useSuperAdminUsers";
import { useFamilyList } from "../hooks/useSuperAdminFamilies";
import { useModalState } from "@/hooks/useModalState";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useRoleList } from "@/hooks/useRoles";
import { SoftDeleteUserModal } from "@/modules/f001-identity/components/SoftDeleteUserModal";
import { useUserListAll } from "@/modules/f001-identity/hooks/useUsers";
import { UserReassignmentFormContainer } from "../forms/userReassignment.form.container";

/**
 * SuperAdmin User Detail container component
 * Handles business logic and API calls via hooks
 */
export function SuperAdminUserDetailContainer() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.user_id as string;
  const [familyId, setFamilyId] = useState<string | null>(null);

  // First, get the user's family_id from the user list
  const { data: usersListData } = useUserListAll();
  
  useEffect(() => {
    if (usersListData?.data?.items) {
      const userItem = usersListData.data.items.find((u) => u.id === userId);
      if (userItem?.family_id) {
        setFamilyId(userItem.family_id);
      }
    }
  }, [usersListData, userId]);

  // Now fetch user detail using family_id
  const { data: userData, isLoading, error } = useUser(familyId, userId);
  const { data: familiesData } = useFamilyList();
  const { data: rolesData } = useRoleList();

  const { isOpen: isReassignOpen, open: openReassign, close: closeReassign } = useModalState();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModalState();
  const { isOpen: isReactivateOpen, open: openReactivate, close: closeReactivate } = useModalState();

  const userDetail = userData?.data?.data;
  const userEtag = userData?.etag;

  const reactivateMutation = useReactivateUser();

  const currentFamilyName = useMemo(() => {
    if (!userDetail?.family_id || !familiesData?.data?.items) return undefined;
    return familiesData.data.items.find((f) => f.id === userDetail.family_id)?.name;
  }, [userDetail, familiesData]);

  const currentRoleName = useMemo(() => {
    return userDetail?.roles_list?.[0]?.name;
  }, [userDetail]);

  const handleReassign = useCallback(() => {
    openReassign();
  }, [openReassign]);

  const handleReassignSuccess = useCallback(() => {
    closeReassign();
  }, [closeReassign]);

  const handleSoftDelete = useCallback(() => {
    openDelete();
  }, [openDelete]);

  const handleConfirmSoftDelete = useCallback(() => {
    // Soft delete would use standard user delete endpoint
    // This is a placeholder - actual implementation would call delete mutation
    closeDelete();
  }, [closeDelete]);

  const handleReactivate = useCallback(() => {
    openReactivate();
  }, [openReactivate]);

  const handleConfirmReactivate = useCallback(() => {
    if (!userDetail || !userEtag) return;

    reactivateMutation.mutate(
      {
        userId: userDetail.id,
        etag: userEtag,
      },
      {
        onSuccess: () => {
          closeReactivate();
        },
      }
    );
  }, [userDetail, userEtag, reactivateMutation, closeReactivate]);

  if (error) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 p-4">
        <p className="text-sm font-medium text-danger-800">
          Error loading user
        </p>
        <p className="mt-1 text-sm text-danger-600">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }

  if (!userDetail) {
    if (!familyId) {
      return (
        <div className="text-center py-12 text-gray-500">
          Loading user information...
        </div>
      );
    }
    return (
      <div className="text-center py-12 text-gray-500">
        User not found
      </div>
    );
  }

  // Adapt UserDetailResponse to UserResponse format
  const adaptedUser: import("../types/responses/user").UserResponse = {
    id: userDetail.id,
    name: userDetail.name,
    email: userDetail.email,
    family_id: userDetail.family_id,
    status: userDetail.status,
    activated_at: userDetail.activated_at,
    invite_sent_at: userDetail.invite_sent_at,
    invite_expire_at: userDetail.invite_expire_at,
    invited_by: userDetail.invited_by,
    is_del: userDetail.is_del,
    roles_list: userDetail.roles_list,
    allowed_role_management: userDetail.allowed_role_management,
    created_at: userDetail.created_at,
    created_by: userDetail.created_by,
    updated_at: userDetail.updated_at,
    updated_by: userDetail.updated_by,
    deleted_at: userDetail.deleted_at,
    deleted_by: userDetail.deleted_by,
  };

  const isPending = adaptedUser.status === "PendingActivation";
  const isDeleted = adaptedUser.status === "SoftDeleted";

  return (
    <>
      <SuperAdminUserDetail
        user={adaptedUser}
        isLoading={isLoading}
        onReassign={handleReassign}
        onSoftDelete={handleSoftDelete}
        onReactivate={isDeleted ? handleReactivate : undefined}
        canReassign={!isDeleted}
        canDelete={!isDeleted}
        canReactivate={isDeleted}
        canResendInvite={isPending}
        currentFamilyName={currentFamilyName}
        currentRoleName={currentRoleName}
      />

      {/* Reassign Modal */}
      <Modal
        isOpen={isReassignOpen}
        onClose={closeReassign}
        title="Reassign User to Family"
        size="md"
      >
        {userDetail && userEtag && (
          <UserReassignmentFormContainer
            userId={userDetail.id}
            etag={userEtag}
            user={userDetail}
            availableFamilies={familiesData?.data?.items || []}
            availableRoles={rolesData?.data?.items || []}
            onSuccess={handleReassignSuccess}
            onCancel={closeReassign}
          />
        )}
      </Modal>

      {/* Soft Delete Modal */}
      <SoftDeleteUserModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmSoftDelete}
        isLoading={false}
        userName={userDetail?.name}
      />

      {/* Reactivate Modal */}
      <Modal
        isOpen={isReactivateOpen}
        onClose={closeReactivate}
        title="Reactivate User"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to reactivate this user?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeReactivate}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmReactivate}
              disabled={reactivateMutation.isPending}
              isLoading={reactivateMutation.isPending}
            >
              Reactivate
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

