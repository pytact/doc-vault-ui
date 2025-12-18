/**
 * SuperAdmin User Hooks
 * Based on R5 and R9 rules
 * F-007 SuperAdmin Console - User management hooks
 */

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { SuperAdminUserService } from "@/services/superadmin/user.service";
import {
  UserReassignRequest,
  UserBulkDeleteRequest,
} from "../types/requests/user";
import {
  UserMutationResponse,
  UserBulkDeleteResponse,
} from "../types/responses/user";

/**
 * Reassign user to different family mutation hook
 * POST /v1/users/{user_id}/reassign
 * SuperAdmin only
 */
export function useReassignUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
      etag,
    }: {
      userId: string;
      payload: UserReassignRequest;
      etag: string;
    }) => SuperAdminUserService.reassign(userId, payload, etag),
    onSuccess: (data, variables) => {
      // Invalidate user lists (all and family-specific)
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // Invalidate specific user detail
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Invalidate analytics dashboard (user count may change)
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

/**
 * Reactivate soft-deleted user mutation hook
 * POST /v1/users/{user_id}/reactivate
 * SuperAdmin only
 */
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      etag,
    }: {
      userId: string;
      etag: string;
    }) => SuperAdminUserService.reactivate(userId, etag),
    onSuccess: (data, variables) => {
      // Invalidate user lists (all and family-specific)
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // Invalidate specific user detail
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      // Invalidate soft-deleted users list
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] });
      
      // Invalidate analytics dashboard (user count may change)
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

/**
 * Bulk delete users mutation hook
 * POST /v1/users/bulk-delete
 * SuperAdmin only
 */
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserBulkDeleteRequest) =>
      SuperAdminUserService.bulkDelete(payload),
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users", "deleted"] });
      
      // Invalidate analytics dashboard (user count will change)
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

