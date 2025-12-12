/**
 * Profile Hooks
 * Based on R5 and R9 rules
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/services/profile/profile.service";
import {
  UserProfileUpdateRequest,
  UserPasswordChangeRequest,
} from "@/types/requests/user.requests";
import {
  ProfileGetResponse,
  ProfileUpdateResponse,
  PasswordChangeResponse,
} from "@/types/responses/profile.responses";

/**
 * Get current user profile query hook
 * GET /v1/users/me
 * Only enabled when user is authenticated (has token)
 */
export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => ProfileService.get(),
    enabled, // Only fetch when enabled (user is authenticated)
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Update profile mutation hook
 * PATCH /v1/users/me
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      etag,
    }: {
      payload: UserProfileUpdateRequest;
      etag?: string;
    }) => ProfileService.update(payload, etag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

/**
 * Change password mutation hook
 * POST /v1/users/me/password/change
 */
export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserPasswordChangeRequest) =>
      ProfileService.changePassword(payload),
    onSuccess: () => {
      // Optionally invalidate profile to refresh any password-related metadata
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

