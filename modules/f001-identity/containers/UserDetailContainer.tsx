/**
 * User Detail Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserDetail } from "../components/UserDetail";
import { useUser, useUpdateUserRoles, useSoftDeleteUser } from "../hooks/useUsers";
import { useRoleList } from "@/hooks/useRoles";
import { useAuthContext } from "@/contexts/auth.context";
import { useFamilyContext } from "@/contexts/family.context";
import { useUserPermissions } from "../hooks/useUserPermissions";
import { useFamily } from "../hooks/useFamilies";
import { useModalState } from "@/hooks/useModalState";
import { ManageRolesModal } from "../components/ManageRolesModal";
import { SoftDeleteUserModal } from "../components/SoftDeleteUserModal";
import { useNotificationContext } from "@/contexts/notification.context";
import { userRoutes } from "@/utils/routing";

/**
 * User detail container component
 * Handles business logic and API calls via hooks
 */
export function UserDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.user_id as string;
  const familyIdFromParams = params?.family_id as string; // For SuperAdmin viewing users in specific family
  const { user } = useAuthContext();
  const { familyId: familyIdFromContext } = useFamilyContext();
  
  // Use familyId from URL params (for SuperAdmin) or from context (for FamilyAdmin)
  const familyId = familyIdFromParams || familyIdFromContext;
  
  console.log("UserDetailContainer - Params:", { userId, familyIdFromParams, familyIdFromContext, familyId });
  
  const { data: userData, isLoading, refetch: refetchUser, error: userError } = useUser(familyId || null, userId);
  const { currentFamily } = useFamilyContext();
  // For SuperAdmin, get family data from the familyId in URL params
  const { data: familyData } = useFamily(familyIdFromParams || null);
  const userDetail = userData?.data?.data;
  
  // Use family status from familyData (for SuperAdmin) or currentFamily (for FamilyAdmin)
  const familyStatus = familyData?.data?.data?.status || currentFamily?.status || "Active";
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // This ensures hooks are called in the same order on every render
  const manageRolesModal = useModalState();
  const softDeleteModal = useModalState();
  const { addNotification } = useNotificationContext();
  const updateRolesMutation = useUpdateUserRoles();
  const softDeleteMutation = useSoftDeleteUser();
  const { data: rolesData } = useRoleList();

  // Get target user's role from roles_list (user has single role)
  const targetUserRole = userDetail?.roles_list && userDetail.roles_list.length > 0
    ? (userDetail.roles_list[0].name as "superadmin" | "familyadmin" | "member" | null)
    : null;

  const { canManageUserRoles, canSoftDeleteUser } = useUserPermissions({
    currentUserRole: user?.role || null,
    currentUserId: user?.id || null,
    targetUserStatus: userDetail?.status || null,
    targetUserId: userDetail?.id || null,
    familyStatus: familyStatus,
    targetUserRole: targetUserRole, // Pass target user's role to check if FamilyAdmin is managing SuperAdmin
  });

  // Debug logging for permissions
  console.log("UserDetailContainer - Permissions:", {
    currentUserRole: user?.role,
    currentUserId: user?.id,
    targetUserStatus: userDetail?.status,
    targetUserId: userDetail?.id,
    targetUserRole: targetUserRole,
    familyStatus: familyStatus,
    canManageUserRoles,
    canSoftDeleteUser,
  });

  // ALL useCallback HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const handleManageRoles = useCallback(() => {
    manageRolesModal.open();
  }, [manageRolesModal]);

  const handleSoftDelete = useCallback(() => {
    softDeleteModal.open();
  }, [softDeleteModal]);

  const handleConfirmManageRoles = useCallback(
    async (roleIds: string[]) => {
      if (!familyId || !userId) {
        addNotification({
          type: "error",
          message: "Missing required information. Please refresh and try again.",
          title: "Error",
        });
        return;
      }

      // Prevent FamilyAdmin from managing SuperAdmin roles
      if (user?.role === "familyadmin" && targetUserRole === "superadmin") {
        addNotification({
          type: "error",
          message: "FamilyAdmin cannot manage roles for SuperAdmin users.",
          title: "Permission Denied",
        });
        return;
      }

      // Prevent FamilyAdmin from assigning SuperAdmin role to any user
      if (user?.role === "familyadmin") {
        // Check if any of the selected roles is SuperAdmin
        const selectedRoles = rolesData?.data?.items?.filter((role) => 
          roleIds.includes(role.id)
        ) || [];
        const hasSuperAdminRole = selectedRoles.some(
          (role) => role.name.toLowerCase() === "superadmin"
        );
        
        if (hasSuperAdminRole) {
          addNotification({
            type: "error",
            message: "FamilyAdmin cannot assign SuperAdmin role to users.",
            title: "Permission Denied",
          });
          return;
        }
      }

      try {
        // Refetch user data to get the latest ETag before role update
        console.log("UserDetailContainer - Refetching user data to get latest ETag...");
        const freshUserData = await refetchUser();
        
        // Get ETag from fresh user data or cached data
        const etag = freshUserData.data?.etag || userData?.etag;
        
        console.log("UserDetailContainer - ETag values:", {
          freshFromRefetch: freshUserData.data?.etag,
          cached: userData?.etag,
          using: etag
        });
        
        if (!etag) {
          addNotification({
            type: "error",
            message: "ETag is required for role update. Please refresh the page and try again.",
            title: "Error",
          });
          return;
        }

        console.log("UserDetailContainer - Calling role update mutation with ETag in header", { familyId, userId, roleIds, etag });
        await updateRolesMutation.mutateAsync({
          familyId,
          userId,
          payload: { role_ids: roleIds },
          etag: etag, // ETag is passed in If-Match header
        });
        console.log("UserDetailContainer - Role update mutation successful");
        addNotification({
          type: "success",
          message: "User roles updated successfully",
          title: "Success",
        });
        manageRolesModal.close();
      } catch (err: any) {
        console.error("UserDetailContainer - Role update error:", err);
        
        // Check if it's a PRECONDITION_FAILED error (ETag mismatch)
        if (err?.error?.code === "PRECONDITION_FAILED" ||
            err?.response?.data?.error?.code === "PRECONDITION_FAILED") {
          addNotification({
            type: "error",
            message: "The user was modified by another user. Please refresh the page and try again.",
            title: "Resource Modified",
          });
        } else {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update user roles. Please try again.";
        addNotification({
          type: "error",
          message: errorMessage,
          title: "Update Failed",
        });
        }
      }
    },
    [familyId, userId, userData?.etag, refetchUser, updateRolesMutation, addNotification, manageRolesModal, user?.role, targetUserRole, rolesData?.data?.items]
  );

  const handleConfirmSoftDelete = useCallback(async () => {
    if (!familyId || !userId) {
      addNotification({
        type: "error",
        message: "Missing required information. Please refresh and try again.",
        title: "Error",
      });
      return;
    }
    
    const etag = userData?.etag;
    if (!etag) {
      addNotification({
        type: "error",
        message: "ETag is required for delete operations. Please refresh the page and try again.",
        title: "Error",
      });
      return;
    }

    try {
      await softDeleteMutation.mutateAsync({
        familyId,
        userId,
        etag,
      });
      addNotification({
        type: "success",
        message: "User soft-deleted successfully",
        title: "Success",
      });
      softDeleteModal.close();
      
      // Navigate to the correct route based on context
      // If familyIdFromParams exists, we're in SuperAdmin family context
      // Otherwise, use the standard family users route
      const redirectRoute = familyIdFromParams 
        ? userRoutes.listForFamily(familyIdFromParams)
        : userRoutes.list;
      router.push(redirectRoute);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to soft-delete user. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Delete Failed",
      });
    }
  }, [familyId, userId, userData?.etag, softDeleteMutation, addNotification, softDeleteModal, router, familyIdFromParams]);

  // ALL useMemo HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Filter out SuperAdmin role if current user is FamilyAdmin
  // FamilyAdmin should not be able to assign SuperAdmin role to any user
  const availableRoles = React.useMemo(() => {
    const allRoles = rolesData?.data?.items || [];
    if (user?.role === "familyadmin") {
      // FamilyAdmin cannot assign SuperAdmin role
      return allRoles.filter((role) => role.name.toLowerCase() !== "superadmin");
    }
    return allRoles;
  }, [rolesData?.data?.items, user?.role]);

  // NOW we can do conditional returns AFTER all hooks are called
  // If familyId is missing, show error (API requires family_id)
  if (!familyId && !isLoading) {
    console.error("UserDetailContainer - Family ID is required but not available");
    return (
      <div className="p-4">
        <div className="text-red-600 font-semibold">Error: Family ID Required</div>
        <p className="mt-2 text-gray-600">
          Unable to load user details. Family ID is required to fetch user information.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please navigate to the user from their family's user list, or ensure the user list response includes family_id.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading user...</div>;
  }

  if (userError) {
    console.error("UserDetailContainer - User fetch error:", userError);
    return (
      <div className="p-4">
        <div className="text-red-600 font-semibold">Error Loading User</div>
        <p className="mt-2 text-gray-600">
          {userError instanceof Error ? userError.message : "Failed to load user details. Please try again."}
        </p>
      </div>
    );
  }

  if (!userDetail) {
    return <div>User not found</div>;
  }

  // Safe to use userDetail now - all hooks called and early returns handled
  const currentRoleIds = userDetail.roles_list?.map((role: { id: string }) => role.id) || [];

  // Determine the correct back route based on context
  // If familyIdFromParams exists, we're in SuperAdmin family context, use family-specific route
  // Otherwise, use the standard family users route
  const backRoute = familyIdFromParams 
    ? userRoutes.listForFamily(familyIdFromParams)
    : userRoutes.list;

  return (
    <>
      <UserDetail
        user={userDetail}
        currentUserRole={user?.role || null}
        currentUserId={user?.id || null}
        onManageRoles={handleManageRoles}
        onSoftDelete={handleSoftDelete}
        backRoute={backRoute}
        canSoftDelete={canSoftDeleteUser}
        canManageRoles={canManageUserRoles} // Pass permission check (prevents FamilyAdmin from managing SuperAdmin)
      />

      <ManageRolesModal
        isOpen={manageRolesModal.isOpen}
        onClose={manageRolesModal.close}
        onConfirm={handleConfirmManageRoles}
        isLoading={updateRolesMutation.isPending}
        availableRoles={availableRoles}
        currentRoleIds={currentRoleIds}
        userName={userDetail.name}
      />

      <SoftDeleteUserModal
        isOpen={softDeleteModal.isOpen}
        onClose={softDeleteModal.close}
        onConfirm={handleConfirmSoftDelete}
        isLoading={softDeleteMutation.isPending}
        userName={userDetail.name}
      />
    </>
  );
}

