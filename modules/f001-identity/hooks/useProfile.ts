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
} from "../types/responses/profile";
import { useAuthContext } from "@/contexts/auth.context";

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
 * PATCH /v1/users/{user_id}
 * Uses the same update endpoint as profile update, with password fields
 * ETag is passed in the If-Match header
 */
export function useChangePassword() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: ({
      current_password,
      new_password,
      etag,
      currentName,
    }: UserPasswordChangeRequest & { etag?: string; currentName?: string }) => {
      if (!user?.id) {
        throw new Error("User ID is required. Please log in again.");
      }

      if (!currentName) {
        throw new Error("Current name is required for password change.");
      }

      // Convert password change request to profile update request format
      // Include current name to prevent it from being changed
      const payload: UserProfileUpdateRequest = {
        user_id: user.id,
        name: currentName,
        password: new_password,
        current_password: current_password,
      };

      return ProfileService.update(user.id, payload, etag);
    },
    onSuccess: () => {
      // Optionally invalidate profile to refresh any password-related metadata
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

