/**
 * Profile Form Submit Hook
 * Custom hook for profile form submission
 * Based on R10 rules
 */

import { useUpdateProfile } from "../hooks/useProfile";
import { useProfile } from "../hooks/useProfile";
import { useAuthContext } from "@/contexts/auth.context";
import type { ProfileFormSchema } from "./profile.schema";
import type { UserProfileUpdateRequest } from "../types/requests/user";

/**
 * Profile form submit hook
 * Handles profile update form submission logic
 */
export function useProfileFormSubmit() {
  const updateMutation = useUpdateProfile();
  const { data: profileData, refetch: refetchProfile } = useProfile();
  const { user } = useAuthContext();

  async function submit(values: ProfileFormSchema) {
    // Get user ID from auth context
    if (!user?.id) {
      throw new Error("User ID is required. Please log in again.");
    }
    
    // Refetch profile data to get the latest ETag before update
    const freshProfileData = await refetchProfile();
    
    // Get ETag from fresh profile data or cached data
    const etag = freshProfileData.data?.etag || profileData?.etag;
    if (!etag) {
      throw new Error("ETag is required for update operations. Please refresh the page and try again.");
    }
    
    // Build payload - only name is updated (password change is separate)
    // ETag is sent in If-Match header, not in payload
    const payload: UserProfileUpdateRequest = {
      user_id: user.id,
      name: values.name,
    };
    
    return await updateMutation.mutateAsync({
      userId: user.id,
      payload,
      etag, // ETag is passed separately to be included in If-Match header
    });
  }

  return {
    submit,
    isLoading: updateMutation.isPending,
    error: updateMutation.error,
  };
}

