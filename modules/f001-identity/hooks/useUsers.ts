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
} from "../types/requests/user";
import {
  UserListResponse,
  UserDetailResponseWrapper,
  UserSoftDeleteResponse,
  UserRoleUpdateResponse,
} from "../types/responses/user";
import { InvitationCreateResponse } from "../types/responses/invitation";

/**
 * User list query hook for all users (SuperAdmin only)
 * GET /v1/users
 */
export function useUserListAll(params?: UserListParams) {
  return useQuery({
    queryKey: [
      "users",
      "all",
      params?.page,
      params?.page_size,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => UserService.listAll(params),
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

/**
 * User list query hook for users in a family
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
 * Returns data with eTag for update operations
 */
export function useUser(familyId: string | null, userId: string | null) {
  return useQuery({
    queryKey: ["user", familyId, userId],
    queryFn: async () => {
      if (!familyId || !userId) throw new Error("Family ID and User ID are required");
      const result = await UserService.getById(familyId, userId);
      return {
        data: result.data,
        etag: result.etag,
      };
    },
    enabled: !!familyId && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Invite user mutation hook
 * POST /v1/invite
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
      queryClient.invalidateQueries({ queryKey: ["users", "all"] }); // Also invalidate all users list
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
      queryClient.invalidateQueries({ queryKey: ["users", "all"] }); // Also invalidate all users list
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
      queryClient.invalidateQueries({ queryKey: ["users", "all"] }); // Also invalidate all users list
      queryClient.invalidateQueries({
        queryKey: ["user", variables.familyId, variables.userId],
      });
    },
  });
}

