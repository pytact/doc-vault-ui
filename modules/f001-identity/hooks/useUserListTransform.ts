/**
 * User List Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for user list display
 */

import { useMemo } from "react";
import { UserListResponseItem } from "../types/responses/user";
import { format } from "date-fns";

interface TransformedUserItem extends UserListResponseItem {
  roleName: string;
  activationStateLabel: string;
  isActivationExpired: boolean;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  inviteExpireAtFormatted: string | null;
}

interface UseUserListTransformParams {
  users: UserListResponseItem[] | undefined;
}

interface UseUserListTransformReturn {
  transformedUsers: TransformedUserItem[];
  activeUsersCount: number;
  pendingUsersCount: number;
  deletedUsersCount: number;
}

/**
 * User list transformation hook
 * Transforms user list data with derived fields and formatting
 */
export function useUserListTransform(
  params: UseUserListTransformParams
): UseUserListTransformReturn {
  const { users = [] } = params;

  const transformedUsers = useMemo(() => {
    return users.map((user) => {
      // Get role name (single role per user)
      const roleName = user.roles_summary?.[0] || "No Role";

      // Calculate activation state label
      let activationStateLabel = "Unknown";
      let isActivationExpired = false;

      if (user.status === "Active") {
        activationStateLabel = "Active";
      } else if (user.status === "PendingActivation") {
        if (user.invite_expire_at) {
          const expireDate = new Date(user.invite_expire_at);
          const now = new Date();
          isActivationExpired = now > expireDate;
          activationStateLabel = isActivationExpired ? "Expired" : "Pending";
        } else {
          activationStateLabel = "Pending";
        }
      } else if (user.status === "SoftDeleted") {
        activationStateLabel = "Deleted";
      }

      // Format dates
      const createdAtFormatted = user.created_at
        ? format(new Date(user.created_at), "MMM dd, yyyy")
        : "";
      const updatedAtFormatted = user.updated_at
        ? format(new Date(user.updated_at), "MMM dd, yyyy")
        : "";
      const inviteExpireAtFormatted = user.invite_expire_at
        ? format(new Date(user.invite_expire_at), "MMM dd, yyyy HH:mm")
        : null;

      return {
        ...user,
        roleName,
        activationStateLabel,
        isActivationExpired,
        createdAtFormatted,
        updatedAtFormatted,
        inviteExpireAtFormatted,
      };
    });
  }, [users]);

  const activeUsersCount = useMemo(() => {
    return transformedUsers.filter((u) => u.status === "Active").length;
  }, [transformedUsers]);

  const pendingUsersCount = useMemo(() => {
    return transformedUsers.filter((u) => u.status === "PendingActivation")
      .length;
  }, [transformedUsers]);

  const deletedUsersCount = useMemo(() => {
    return transformedUsers.filter((u) => u.status === "SoftDeleted").length;
  }, [transformedUsers]);

  return {
    transformedUsers,
    activeUsersCount,
    pendingUsersCount,
    deletedUsersCount,
  };
}

