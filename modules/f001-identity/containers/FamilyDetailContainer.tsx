/**
 * Family Detail Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FamilyDetail } from "../components/FamilyDetail";
import { useFamily } from "../hooks/useFamilies";
import { useQueryClient } from "@tanstack/react-query";
import { useFamilyPermissions } from "../hooks/useFamilyPermissions";
import { useUserPermissions } from "../hooks/useUserPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useFamilyContext } from "@/contexts/family.context";
import { useModalState } from "@/hooks/useModalState";
import { FamilyFormContainer } from "../forms/family.form.container";
import { Modal } from "@/components/ui/modal";
import { DeleteFamilyModal } from "../components/DeleteFamilyModal";
import { useDeleteFamily } from "../hooks/useFamilies";
import { useNotificationContext } from "@/contexts/notification.context";
import { familyRoutes } from "@/utils/routing";
import { InviteUserFormContainerForFamily } from "../forms/inviteUser.form.container.forFamily";
import { UserRole } from "../types/responses/auth";

/**
 * Family detail container component
 * Handles business logic and API calls via hooks
 */
export function FamilyDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const familyId = params?.family_id as string;
  const { user } = useAuthContext();
  const { familyId: userFamilyId } = useFamilyContext();
  const { addNotification } = useNotificationContext();
  const queryClient = useQueryClient();
  const { data: familyData, isLoading, refetch } = useFamily(familyId);

  // Validate family ownership for FamilyAdmin and Member
  // SuperAdmin can access any family, but FamilyAdmin/Member can only access their own
  React.useEffect(() => {
    if (!isLoading && user && familyData?.data?.data) {
      const isSuperAdmin = user.role === UserRole.SuperAdmin;
      const isOwnFamily = userFamilyId === familyId;
      
      // If user is FamilyAdmin or Member, they can only view their own family
      if (!isSuperAdmin && !isOwnFamily) {
        addNotification({
          type: "error",
          message: "You can only view your own family details.",
          title: "Access Denied",
        });
        // Redirect to appropriate dashboard based on role
        if (user.role === UserRole.FamilyAdmin || user.role === UserRole.Member) {
          router.push("/dashboard");
        } else {
          router.push(familyRoutes.list);
        }
      }
    }
  }, [isLoading, user, familyId, userFamilyId, familyData, router, addNotification]);
  const { canEditFamily, canSoftDeleteFamily } = useFamilyPermissions({
    currentUserRole: user?.role || null,
    familyStatus: familyData?.data?.data?.status || null,
    permissions: user?.permissions || null,
  });

  const { canViewUserDetails, canInviteUsers } = useUserPermissions({
    currentUserRole: user?.role || null,
    currentUserId: user?.id || null,
    familyStatus: familyData?.data?.data?.status || null,
  });

  const editModal = useModalState();
  const deleteModal = useModalState();
  const inviteModal = useModalState();
  const deleteFamilyMutation = useDeleteFamily();

  const handleEditFamily = useCallback(() => {
    editModal.open();
  }, [editModal]);

  const handleDelete = useCallback(() => {
    deleteModal.open();
  }, [deleteModal]);

  const handleInviteUser = useCallback(() => {
    inviteModal.open();
  }, [inviteModal]);

  const handleInviteSuccess = useCallback(() => {
    inviteModal.close();
  }, [inviteModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!familyId) {
      addNotification({
        type: "error",
        message: "Family ID is missing. Please refresh the page and try again.",
        title: "Error",
      });
      return;
    }
    
    const etag = familyData?.etag;
    
    if (!etag) {
      addNotification({
        type: "error",
        message: "ETag is required for delete operations. Please refresh the page and try again.",
        title: "Error",
      });
      return;
    }
    
    try {
      await deleteFamilyMutation.mutateAsync({ familyId, etag });
      addNotification({
        type: "success",
        message: "Family deleted successfully",
        title: "Success",
      });
      deleteModal.close();
      router.push(familyRoutes.list);
    } catch (error: any) {
      // Check if it's a PRECONDITION_FAILED error (ETag mismatch)
      if (error?.error?.code === "PRECONDITION_FAILED" || 
          error?.response?.data?.error?.code === "PRECONDITION_FAILED") {
        addNotification({
          type: "error",
          message: "The family was modified by another user. Please refresh the page and try again.",
          title: "Resource Modified",
        });
        // Refetch only on ETag mismatch to update the UI with latest data
        await refetch();
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : error?.error?.message || error?.response?.data?.message || "Failed to delete family. Please try again.";
        addNotification({
          type: "error",
          message: errorMessage,
          title: "Delete Failed",
        });
      }
    }
  }, [familyId, familyData?.etag, deleteFamilyMutation, deleteModal, addNotification, router, refetch]);

  const handleEditSuccess = useCallback(async () => {
    editModal.close();
    // Refetch family data to show updated name
    if (familyId) {
      // Invalidate and refetch the family query
      await queryClient.invalidateQueries({ queryKey: ["family", familyId] });
      await refetch();
    }
  }, [editModal, familyId, queryClient, refetch]);

  // Redirect if family not found or soft-deleted
  useEffect(() => {
    if (!isLoading && (!familyData?.data?.data || familyData.data.data.status === "SoftDeleted")) {
      router.push(familyRoutes.notAccessible(familyId));
    }
  }, [isLoading, familyData, familyId, router]);

  if (isLoading) {
    return <div>Loading family...</div>;
  }

  if (!familyData?.data?.data || familyData.data.data.status === "SoftDeleted") {
    return null;
  }

  return (
    <>
      <FamilyDetail
        family={familyData.data.data}
        canEditFamily={canEditFamily}
        canSoftDeleteFamily={canSoftDeleteFamily}
        canViewUsers={canViewUserDetails}
        canInviteUsers={canInviteUsers}
        onEditFamily={handleEditFamily}
        onSoftDeleteFamily={handleDelete}
        onInviteUser={handleInviteUser}
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Family Name"
      >
        <div className="p-1">
          <FamilyFormContainer
            familyId={familyId}
            onSuccess={handleEditSuccess}
            onCancel={editModal.close}
          />
        </div>
      </Modal>

      <DeleteFamilyModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteFamilyMutation.isPending}
        familyName={familyData?.data?.data?.name}
      />

      <Modal
        isOpen={inviteModal.isOpen}
        onClose={inviteModal.close}
        title="Invite User"
      >
        <InviteUserFormContainerForFamily
          familyId={familyId}
          onSuccess={handleInviteSuccess}
          onCancel={inviteModal.close}
        />
      </Modal>
    </>
  );
}

