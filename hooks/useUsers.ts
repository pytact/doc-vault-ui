/**
 * User Hooks
 * Based on R5 and R9 rules
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { UserService } from "@/services/users/user.service";
import {
  UserInviteRequest,
  UserListParams,
  UserRoleUpdateRequest,
} from "@/types/requests/user.requests";
import {
  UserListResponse,
  UserDetailResponseWrapper,
  UserSoftDeleteResponse,
  UserRoleUpdateResponse,
} from "@/types/responses/user.responses";
import { InvitationCreateResponse } from "@/types/responses/invitation.responses";

/**
 * User list query hook
 * GET /v1/families/{family_id}/users
 */
export function useUserList(familyId: string | null, params?: UserListParams) {
  return useQuery({
    queryKey: [
      "users",
      familyId,
      params?.page,
      params?.page_size,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => {
      if (!familyId) throw new Error("Family ID is required");
      return UserService.list(familyId, params);
    },
    enabled: !!familyId,
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

/**
 * User detail query hook
 * GET /v1/families/{family_id}/users/{user_id}
 */
export function useUser(familyId: string | null, userId: string | null) {
  return useQuery({
    queryKey: ["user", familyId, userId],
    queryFn: () => {
      if (!familyId || !userId) throw new Error("Family ID and User ID are required");
      return UserService.getById(familyId, userId);
    },
    enabled: !!familyId && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Invite user mutation hook
 * POST /v1/invite/families/{family_id}/users/
 */
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      payload,
    }: {
      familyId: string;
      payload: UserInviteRequest;
    }) => UserService.invite(familyId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.familyId] });
    },
  });
}

/**
 * Soft delete user mutation hook
 * PATCH /v1/families/{family_id}/users/{user_id}/soft-delete
 */
export function useSoftDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      userId,
      etag,
    }: {
      familyId: string;
      userId: string;
      etag?: string;
    }) => UserService.softDelete(familyId, userId, etag),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.familyId] });
      queryClient.invalidateQueries({
        queryKey: ["user", variables.familyId, variables.userId],
      });
    },
  });
}

/**
 * Update user roles mutation hook
 * PATCH /v1/roles/families/{family_id}/users/{user_id}/
 */
export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      userId,
      payload,
      etag,
    }: {
      familyId: string;
      userId: string;
      payload: UserRoleUpdateRequest;
      etag?: string;
    }) => UserService.updateRoles(familyId, userId, payload, etag),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.familyId] });
      queryClient.invalidateQueries({
        queryKey: ["user", variables.familyId, variables.userId],
      });
    },
  });
}

