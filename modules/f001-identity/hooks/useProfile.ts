/**
 * Profile Hooks
 * Based on R5 and R9 rules
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/profile/profile.service";
import {
  UserProfileUpdateRequest,
  UserPasswordChangeRequest,
} from "../types/requests/user";
import {
  ProfileGetResponse,
  ProfileUpdateResponse,
  PasswordChangeResponse,
} from "../types/responses/profile";

/**
 * Get current user profile query hook
 * GET /v1/users/me
 * Only enabled when user is authenticated (has token)
 * Returns data with eTag for update operations
 */
export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const result = await ProfileService.get();
      return {
        data: result.data,
        etag: result.etag,
      };
    },
    enabled, // Only fetch when enabled (user is authenticated)
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Update profile mutation hook
 * PATCH /v1/users/{user_id}
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
      etag,
    }: {
      userId: string;
      payload: UserProfileUpdateRequest;
      etag?: string;
    }) => ProfileService.update(userId, payload, etag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

/**
 * Change password mutation hook
 * POST /v1/users/me/password/change
 * ETag is passed in the If-Match header
 */
export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      current_password,
      new_password,
      etag,
    }: UserPasswordChangeRequest & { etag?: string }) =>
      ProfileService.changePassword(
        { current_password, new_password },
        etag
      ),
    onSuccess: () => {
      // Optionally invalidate profile to refresh any password-related metadata
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

