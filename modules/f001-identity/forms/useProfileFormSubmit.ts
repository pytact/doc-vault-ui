/**
 * Profile Form Submit Hook
 * Custom hook for profile form submission
 * Based on R10 rules
 */

import { useUpdateProfile } from "@/hooks/useProfile";
import { useProfile } from "@/hooks/useProfile";
import type { ProfileFormSchema } from "./profile.schema";

/**
 * Profile form submit hook
 * Handles profile update form submission logic
 */
export function useProfileFormSubmit() {
  const updateMutation = useUpdateProfile();
  const { data: profileData } = useProfile();

  async function submit(values: ProfileFormSchema) {
    // Get ETag from profile data if available
    const etag = profileData?.data ? undefined : undefined; // ETag would come from response headers
    return await updateMutation.mutateAsync({
      payload: values,
      etag,
    });
  }

  return {
    submit,
    isLoading: updateMutation.isPending,
    error: updateMutation.error,
  };
}

