/**
 * User Detail Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for user detail display
 */

import { useMemo } from "react";
import { UserDetailResponse } from "../types/responses/user";
import { format } from "date-fns";

interface TransformedUserDetail extends UserDetailResponse {
  currentRole: { id: string; name: string } | null;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  activatedAtFormatted: string | null;
  inviteSentAtFormatted: string | null;
  inviteExpireAtFormatted: string | null;
}

interface UseUserDetailTransformParams {
  user: UserDetailResponse | undefined;
  currentUserRole: "superadmin" | "familyadmin" | "member" | null;
  currentUserId: string | null;
}

interface UseUserDetailTransformReturn {
  transformedUser: TransformedUserDetail | null;
  allowedRoleManagement: boolean;
  canPerformActions: boolean;
}

/**
 * User detail transformation hook
 * Transforms user detail data with derived fields, permissions, and formatting
 */
export function useUserDetailTransform(
  params: UseUserDetailTransformParams
): UseUserDetailTransformReturn {
  const { user, currentUserRole, currentUserId } = params;

  const transformedUser = useMemo(() => {
    if (!user) return null;

    // Get current role (single role per user)
    const currentRole =
      user.roles_list && user.roles_list.length > 0
        ? { id: user.roles_list[0].id, name: user.roles_list[0].name }
        : null;

    // Format dates
    const createdAtFormatted = user.created_at
      ? format(new Date(user.created_at), "MMM dd, yyyy HH:mm")
      : "";
    const updatedAtFormatted = user.updated_at
      ? format(new Date(user.updated_at), "MMM dd, yyyy HH:mm")
      : "";
    const activatedAtFormatted = user.activated_at
      ? format(new Date(user.activated_at), "MMM dd, yyyy HH:mm")
      : null;
    const inviteSentAtFormatted = user.invite_sent_at
      ? format(new Date(user.invite_sent_at), "MMM dd, yyyy HH:mm")
      : null;
    const inviteExpireAtFormatted = user.invite_expire_at
      ? format(new Date(user.invite_expire_at), "MMM dd, yyyy HH:mm")
      : null;

    return {
      ...user,
      currentRole,
      createdAtFormatted,
      updatedAtFormatted,
      activatedAtFormatted,
      inviteSentAtFormatted,
      inviteExpireAtFormatted,
    };
  }, [user]);

  const allowedRoleManagement = useMemo(() => {
    if (!user) return false;
    if (user.status === "SoftDeleted") return false;
    return (
      currentUserRole === "superadmin" || currentUserRole === "familyadmin"
    );
  }, [user, currentUserRole]);

  const canPerformActions = useMemo(() => {
    if (!user) return false;
    if (user.status === "SoftDeleted") return false;
    if (user.id === currentUserId) return false; // Cannot perform actions on self
    return (
      currentUserRole === "superadmin" || currentUserRole === "familyadmin"
    );
  }, [user, currentUserRole, currentUserId]);

  return {
    transformedUser,
    allowedRoleManagement,
    canPerformActions,
  };
}

